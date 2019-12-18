"use strict";
const store = require("../Schema/store");
const shutter = require("../Schema/shutter");
const productStore = require("../Schema/productStore");
const productItem = require("../Schema/productItem");
const availableCash = require("../Schema/availableCash");
const order = require("../Schema/order");
const mongoose = require("mongoose");
const uuid = require("uuid/v4");
exports.create = async request => {
  const response = await store.create(request);
  return response;
};
exports.openOrCloseShutter = async request => {
  const response = await shutter.create(request);
  return response;
};
exports.getShutterCurrentStatus = async storeId => {
  const response = await shutter
    .findOne({ storeId: mongoose.Types.ObjectId(storeId) })
    .sort({ createdAt: -1 });
  return response;
};
exports.getShutterStatus = async storeId => {
  const toDay = new Date();
  const startDate = new Date(
    toDay.getFullYear(),
    toDay.getMonth(),
    toDay.getDate()
  );
  const endDate = new Date(
    toDay.getFullYear(),
    toDay.getMonth(),
    toDay.getDate() + 1
  );
  const response = await shutter
    .findOne({
      storeId: mongoose.Types.ObjectId(storeId),
      createdAt: { $gte: startDate, $lt: endDate }
    })
    .sort({ createdAt: -1 })
    .limit(1);
  return response;
};
exports.assignProductToStore = async request => {
  const response = await productStore.update(
    {
      storeId: mongoose.Types.ObjectId(request.storeId),
      productId: mongoose.Types.ObjectId(request.productId)
    },
    request,
    { upsert: true }
  );
  return response;
};
exports.updateStoreByid = async (storeId, request) => {
  delete request.storeId;
  if (!request.imageUrl) {
    delete request.imageUrl;
  }
  const response = await store.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(storeId) },
    request,
    { new: true }
  );
  return response;
};
exports.getList = async () => {
  let response = await store
    .find({ isWareHouse: false })
    .select({ createdAt: 0, updatedAt: 0, __v: 0 })
    .sort("-createdAt");
  return response;
};
exports.getStoreDetailsByid = async id => {
  const response = await store
    .findById(id)
    .select({ createdAt: 0, updatedAt: 0, __v: 0 });
  return response;
};
exports.getProductListByStore = async storeId => {
  let response = await productStore
    .find({ storeId: mongoose.Types.ObjectId(storeId) })
    .populate({ path: "productId", select: { name: 1, price: 1 } })
    .select({ createdAt: 0, updatedAt: 0, __v: 0 });
  let responseData = JSON.parse(JSON.stringify(response));
  await Promise.all(
    responseData.map(async mData => {
      mData.itemId = null;
      let itemInfo = await productItem.find({ productId: mData.productId._id });
      if (itemInfo[0]) {
        mData.itemId = itemInfo[0].itemId;
      }
    })
  );

  return responseData;
};
exports.wareHouseList = async () => {
  let response = await store
    .find()
    .select({ createdAt: 0, updatedAt: 0, __v: 0 })
    .sort("-createdAt");
  return response;
};
exports.availableCash = async (storeId, request) => {
  if (request.eventId && request.eventId != "") {
    const response = await availableCash.findOneAndUpdate(
      {
        storeId: mongoose.Types.ObjectId(storeId),
        eventId: request.eventId
      },
      request
    );
    if (!response) {
      throw { status: 400, message: "Invalid event Id" };
    }
    return response;
  } else {
    request.eventId = uuid();
    request.storeId = storeId;
    const response = await availableCash.create(request);
    return response;
  }
};
exports.fetchRecords = async (id, filter) => {
  if (!filter.start) {
    filter.start = "2018-10-01";
    filter.end = new Date().toDateString();
  }
  var start = new Date(filter.start);
  var end = new Date(filter.end);
  end.setDate(end.getDate());
  const response = await availableCash
    .find({ storeId: id, createdAt: { $gte: start, $lte: end } })
    .populate({ path: "storeId" })
    .populate({ path: "userId" });
  return response;
};

exports.getStoreInfo = async id => {
  var totalOrders = [];
  var response = {};
  response.orders = await order.find({ storeId: id }).sort({ orderDate: -1 });
  return response;
};

exports.prepareSummary = data => {
  var orders = {};
  var amounts = {};
  var items = {};
  var summary = { totalOrders: [], totalSales: [], itemSold: [] };
  data.orders.map(order => {
    var date = new Date(order.orderDate);
    date = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
    if (!orders[date]) {
      orders[date] = { x: date, y: 1 };
      amounts[date] = { x: date, y: 1 };
    } else {
      orders[date].y++;
      amounts[date].y++;
    }
    order.items.map(item => {
      if (!items[item.name]) {
        items[item.name] = { x: item.name, y: item.quantity };
      } else {
        items[item.name].y += item.quantity;
      }
    });
  });
  Object.keys(orders).map(o => {
    summary.totalOrders.push(orders[o]);
    summary.totalSales.push(amounts[o]);
  });
  Object.keys(items).map(i => {
    summary.itemSold.push(items[i]);
  });
  return summary;
};
