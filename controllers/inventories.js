"use strict";
const inventoryModel = require("../models/inventoryModel");
const storeModel = require("../models/storeModel");
const errorResponseHandler = require("../middlewares/errorResponseHandler");
const validator = require("validatorjs");
const stringifySafe = require("../Helpers/stringifySafe");
const Pusher = require('pusher');
const push = require('../variables').push;
const rules = () => ({
  orderId: ["required", "regex:/^[a-f\\d]{24}$/"],
  userId: ["required", "regex:/^[a-f\\d]{24}$/"],
  storeId: ["required", "regex:/^[a-f\\d]{24}$/"],
  itemId: ["required", "regex:/^[a-f\\d]{24}$/"],
  desitinaionitemId: ["required", "regex:/^[a-f\\d]{24}$/"],
  destinationstoreId: ["required", "regex:/^[a-f\\d]{24}$/"],
  vendorId: ["required", "regex:/^[a-f\\d]{24}$/"],
  processedBy: ["required", "regex:/^[a-f\\d]{24}$/"],
  orderStatus: ["required"],
  title: ["required"],
  price: ["required", "regex:/^[1-9][0-9]*$/"],
  quantity: ["required", "regex:/^[1-9][0-9]*$/"],
  notificationQuantity: ["required", "regex:/^[1-9][0-9]*$/"]
});
const checkPossibleTransferQuantity = async (body) => {
  const checkItemStock = await inventoryModel.getInventoryStockDetails({ storeId: body.source.storeId, itemId: body.source.itemId });
  if (!checkItemStock) {
    throw ({ status: 404, message: 'Stock not found.' })
  }
  if (checkItemStock.quantity < Number(body.quantity)) {
    throw ({ status: 400, message: 'You are trying to transfer illegal amount.' })
  }
  return checkItemStock;
}
const isValid = req => {
  let expectedRules = {};
  const requestedData = new Map(Object.entries(req));
  requestedData.forEach((data, key) => {
    if (key in rules() === true) {
      Object.assign(expectedRules, { [key]: rules()[key] });
    }
  });
  const validation = new validator(req, expectedRules);
  if (!validation.passes()) {
    throw {
      status: 400,
      message: "Invalid Input.",
      data: validation.errors.all()
    };
  }
};
exports.addItem = async ctx => {
  try {
    const body = ctx.request.body;
    isValid({ title: body.title });
    const items = await inventoryModel.create(body);
    ctx.response.ok(items, "Item is created successfully.");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};
exports.updateItem = async ctx => {
  try {
    const itemId = ctx.query.itemId;
    const body = ctx.request.body;
    const item = await inventoryModel.update(itemId, body);
    ctx.response.ok(item, "Item is created successfully.");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};
exports.addItemsOptions = async ctx => {
  try {
    const body = ctx.request.body;
    isValid(body);
    const response = await inventoryModel.addItemsOptions(body);
    ctx.response.ok(response, "ok.");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};
exports.addInventoryStock = async ctx => {
  try {
    const body = ctx.request.body;
    isValid({
      storeId: body.storeId,
      itemId: body.itemId,
      quantity: String(body.quantity),
      notificationQuantity: String(body.notificationQuantity)
    });
    const checkAlreadyExists = await inventoryModel.getStockDetailsByStoreAndItem(
      body.storeId,
      body.itemId
    );
    let response;
    if (checkAlreadyExists) {
      // update the quantity
      response = await inventoryModel.updateStockById(
        checkAlreadyExists._id,
        checkAlreadyExists.quantity + Number(body.quantity)
      );
    } else {
      response = await inventoryModel.addStock(body);
    }
    ctx.response.ok(response, "Stock added.");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};
exports.stockDetailsByStoreAndItem = async ctx => {
  try {
    const storeId = ctx.params.storeId;
    const itemId = ctx.params.itemId;
    isValid({ storeId, itemId });
    const response = await inventoryModel.getStockDetailsByStoreAndItem(
      storeId,
      itemId
    );
    ctx.response.ok(response, "Ok");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};
exports.itemList = async ctx => {
  try {
    const reponse = await inventoryModel.inventoryItemLists();
    ctx.response.ok(reponse, "ok.");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};
exports.getOrderItemsByOrderId = async ctx => {
  try {
    const orderId = ctx.params.orderId;
    const response = await inventoryModel.getOrderItems(orderId);
    ctx.response.ok(response, "Ok.");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};
exports.addProductMapping = async ctx => {
  try {
    const productId = ctx.params.productId;
    const body = ctx.request.body;
    body.productId = productId;
    const response = await inventoryModel.createMappings(body);
    ctx.response.ok(response, "Ok.");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};
exports.productMappingList = async ctx => {
  try {
    const productId = ctx.params.productId;
    const response = await inventoryModel.maplisting(productId);
    ctx.response.ok(response, "Ok.");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};
exports.optionsByItem = async ctx => {
  try {
    const itemId = ctx.params.itemId;
    isValid({ itemId: itemId });
    const response = await inventoryModel.getItemsOptions(itemId);
    ctx.response.ok(response, "Ok.");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};
exports.newPurchase = async ctx => {
  try {
    const body = ctx.request.body;
    const response = await inventoryModel.addNewPurchaseOrder(body);
    await inventoryModel.updateInventoryQuantity(response)
    ctx.response.ok(response, "ok.");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};
exports.purchaseOrdersList = async (ctx) => {
  try {
    var limit = ctx.request.query.limit || 0;
    var status = ctx.request.query.status || "ALL";
    var isOpen = ctx.request.query.isOpen || "";
    const response = await inventoryModel.getPurchaseList(limit, status, isOpen);
    ctx.response.ok(response, "ok.");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};
exports.getItemStocksByStoreId = async ctx => {
  try {
    const storeId = ctx.params.storeId;
    const reponse = await inventoryModel.getItemsStocksByStore(storeId);
    ctx.response.ok(reponse, "ok.");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};
exports.updateNotificationQuantity = async (ctx) => {
  try {
    const body = ctx.request.body;
    // isValid({
    //   storeId: body.storeId,
    //   itemId: body.itemId,
    //   notificationQuantity: String(body.notificationQuantity)
    // });
    const reponse = await inventoryModel.updateNotificationQuantity(body);
    ctx.response.ok(reponse, "ok.");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};
exports.addWareHouseStores = async (ctx) => {
  try {
    const body = ctx.request.body;
    const storeResponse = await storeModel.create(body);
    ctx.response.ok(storeResponse, "ok");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};
exports.wareHouseStores = async (ctx) => {
  try {
    const storeResponse = await storeModel.wareHouseList();
    ctx.response.ok(storeResponse, "ok");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};
exports.transferItemToWareHouse = async (ctx) => {
  try {
    const body = ctx.request.body
    isValid({
      storeId: body.source,
      destinationstoreId: body.destination,
      userId: body.userId
    });
    const result = await inventoryModel.addNewTransfer(body);
    result.items.map(async (itemData) => {
      const destinationStockData = await inventoryModel.getInventoryStockDetails({ storeId: result.destination, itemId: itemData.id });
      const sourceStockData = await inventoryModel.getInventoryStockDetails({ storeId: result.source, itemId: itemData.id });
      await inventoryModel.updateQuantityById({ quantity: sourceStockData.quantity - Number(itemData.quantity), id: sourceStockData._id });
      if (destinationStockData) {
        await inventoryModel.updateQuantityById({ quantity: destinationStockData.quantity + Number(itemData.quantity), id: destinationStockData._id });
      } else {
        await inventoryModel.addStock({ quantity: Number(itemData.quantity), storeId: result.destination, itemId: itemData.id });
      }
    })

    ctx.response.ok(result, "ok");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};
exports.newSalesOrder = async (ctx) => {
  try {
    const body = ctx.request.body;
    isValid({ orderId: body.orderId, userId: body.userId });
    const response = await inventoryModel.addNewSalesOrder(body);
    ctx.response.ok(response, "ok.");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};
exports.getSalesOrderList = async (ctx) => {
  try {
    const response = await inventoryModel.getSalesOrderList();
    ctx.response.ok(response, "ok.");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};
exports.createRequisition = async ctx => {
  try {
    const request = ctx.request.body;
    const response = await inventoryModel.createRequisition(request);
    var pusher = new Pusher(push);
    pusher.trigger('requisition', 'created', {
      "message": "New Requisition Added",
      "response": response
    });
    ctx.response.ok(response, "Requisition Created");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};
exports.requisitionList = async (ctx) => {
  try {
    const storeId = ctx.query.storeId;
    if (storeId === "") {
      const response = await inventoryModel.getPendingRequisitions();
      ctx.response.ok(response, "ok.");
    } else {
      const response = await inventoryModel.getRequisitions(storeId);
      ctx.response.ok(response, "ok.");
    }

  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};
exports.requisitionUpdate = async (ctx) => {
  try {
    const id = ctx.query.requisitionId;
    const body = ctx.request.body;
    const response = await inventoryModel.updateRequisition(body, id);
    ctx.response.ok(response, "ok.");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};

exports.updatePurchase = async ctx => {
  try {
    const id = ctx.params.id;
    const body = ctx.request.body;
    const item = await inventoryModel.updatePO(id, body);
    ctx.response.ok(item, "Purchase order updated.");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};