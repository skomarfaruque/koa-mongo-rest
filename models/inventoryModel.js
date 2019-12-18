"use strict";
const inventory = require('../Schema/inventoryItem');
const purchaseOrder = require('../Schema/purchaseOrder');
const salesOrder = require('../Schema/salesOrder');
const itemMap = require('../Schema/itemMapper');
const inventoryStock = require('../Schema/inventoryStock');
const itemOption = require('../Schema/itemOption');
const inventoryItemTransfer = require('../Schema/inventoryItemTransfer');
const order = require('../Schema/order');
const mongoose = require('mongoose');
const requisition = require('../Schema/requisition');

exports.create = async (request) => {
    const response = await inventory.create(request);
    return response;
};
exports.addStock = async (request) => {
    const response = await inventoryStock.create(request);
    return response;
};
exports.getStockDetailsByStoreAndItem = async (storeId, itemId) => {
    const response = await inventoryStock.findOne({ 'storeId': mongoose.Types.ObjectId(storeId), 'itemId': mongoose.Types.ObjectId(itemId) });
    return response;
};
exports.addItemsOptions = async (request) => {
    const response = await itemOption.create(request);
    return response;
};
exports.getOrderItems = async (orderId) => {
    const orderDetails = await order.findById(orderId).select('storeId');
    const response = await inventory.aggregate([
        { $sort: { createdAt: -1 } },
        { $limit: 2 }
    ])
    let copyResponse = JSON.parse(JSON.stringify(response));
    let finalResponse = {}
    finalResponse.storeId = orderDetails.storeId
    finalResponse.items = []
    await copyResponse.map((copyResponse, key) => {
        finalResponse.items.push({ itemId: copyResponse._id, quantity: key + 1 })
    })
    return finalResponse;
};
exports.inventoryItemLists = async () => {
    const response = await inventory.find().select({ 'createdAt': 0, 'updatedAt': 0, '__v': 0 })
    return response;
};
exports.getItemsOptions = async () => {
    const response = await itemOption.find().select({ 'createdAt': 0, 'updatedAt': 0, '__v': 0, 'itemId': 0, })
    return response;
};
exports.updateStockById = async (id, quantity) => {
    const response = await inventoryStock.update({ _id: mongoose.Types.ObjectId(id) }, {
        $set: { 'quantity': quantity }
    }, { new: true });
    return response;
};
exports.update = async (id, itemDetails) => {
    const response = await inventory.update({ _id: mongoose.Types.ObjectId(id) }, {
        $set: itemDetails
    }, { new: true });
    return response;
};
exports.createMappings = async (request) => {
    const response = await itemMap.findOneAndUpdate({ "productId": mongoose.Types.ObjectId(request.productId), "permutation": request.permutation }, { $set: request }, { upsert: true });
    return response;
};
exports.maplisting = async (productId) => {
    const response = await itemMap.find({ 'productId': mongoose.Types.ObjectId(productId) });
    return response;
};
exports.addNewPurchaseOrder = async (request) => {
    const response = await purchaseOrder.create(request);
    return response;
};
exports.updateInventoryQuantity = async (request, flag) => {
    const response = true
    await request.items.map(async (itemVal) => {
        let stockData = await inventoryStock.findOne({ 'storeId': mongoose.Types.ObjectId(request.storeId), 'itemId': mongoose.Types.ObjectId(itemVal.id) });
        if (stockData) {
            if (flag) {
                await inventoryStock.findOneAndUpdate({ 'storeId': mongoose.Types.ObjectId(request.storeId), 'itemId': mongoose.Types.ObjectId(itemVal.id) },
                    { $set: { quantity: stockData.quantity - itemVal.quantity } });
            } else {
                await inventoryStock.findOneAndUpdate({ 'storeId': mongoose.Types.ObjectId(request.storeId), 'itemId': mongoose.Types.ObjectId(itemVal.id) },
                    { $set: { quantity: stockData.quantity + itemVal.quantity } });
            }
        } else {
            await inventoryStock.create({
                'storeId': request.storeId,
                'itemId': itemVal.id,
                'quantity': itemVal.quantity
            })
        }
    })
    return response;
};
exports.getPurchaseList = async (limit, status, isOpen) => {
    var where = { requisitioner: { $type: 'objectId' }, authoriser: { $type: 'objectId' } };
    if (status !== "ALL") { where.status = status; }
    if (isOpen === "false") { where.isOpen = false; }
    if (isOpen === "true") { where.isOpen = true; }
    const response = await purchaseOrder.find(where)
        .sort({ 'createdAt': -1 })
        .populate('requisitioner')
        .populate('items.id')
        .populate('storeId')
        .populate({ path: 'authoriser', $exists: true })
        .populate('vendorId')
        .populate('approver')
        .limit(Number(limit));
    return response;
};
exports.getItemsStocksByStore = async (storeId) => {
    const response = await inventoryStock.find({ 'storeId': mongoose.Types.ObjectId(storeId) }).populate('itemId')
        .select({ 'createdAt': 0, 'updatedAt': 0, '__v': 0 });
    return response;
};
exports.updateNotificationQuantity = async (request) => {
    request.quantity = 0;
    let response;
    const responseD = await inventoryStock.findOne({ 'storeId': mongoose.Types.ObjectId(request.storeId), 'itemId': mongoose.Types.ObjectId(request.itemId) });
    if (responseD) {
        await inventoryStock.update({ 'storeId': mongoose.Types.ObjectId(request.storeId), 'itemId': mongoose.Types.ObjectId(request.itemId) }, { $set: { 'notificationQuantity': request.notificationQuantity } });
    } else {
        await inventoryStock.create(request);
    }
    return response;
};
exports.getInventoryStockDetails = async (request) => {
    const response = await inventoryStock.findOne({ 'storeId': mongoose.Types.ObjectId(request.storeId), 'itemId': mongoose.Types.ObjectId(request.itemId) });
    return response;
};
exports.addNewTransfer = async (request) => {
    const response = await inventoryItemTransfer.create(request);
    return response;
};
exports.updateQuantityById = async (request) => {
    const response = await inventoryStock.update({ '_id': mongoose.Types.ObjectId(request.id) }, { $set: { 'quantity': request.quantity } });
    return response;
};
exports.addNewSalesOrder = async (request) => {
    const orderDetails = await order.findOne({ '_id': mongoose.Types.ObjectId(request.orderId) });
    let coreData = []
    await Promise.all(orderDetails.items.map(async (itemData) => {
        let rawData = { quantity: itemData.quantity, productId: itemData.itemId };
        rawData.permutation = '';
        await itemData.attributes.map(async (attributeData) => {
            rawData.permutation += rawData.permutation === '' ? `${attributeData.name}:${attributeData.option.name}` : ` ${attributeData.name}:${attributeData.option.name}`
        })
        await itemData.addons.map(async (addonData) => {
            coreData.push({ quantity: itemData.quantity, productId: addonData.id, permutation: 'Default' })
        })
        coreData.push(rawData)
    }));
    let finalArray = [];
    await Promise.all(coreData.map(async (coreVal) => {
        let mappedItems = await itemMap.findOne({ 'productId': mongoose.Types.ObjectId(coreVal.productId), 'permutation': coreVal.permutation ? coreVal.permutation : 'Default' }).select('itemMap');
        await Promise.all(mappedItems.itemMap.map(async (inventoryItems) => {
            let foundIn = await finalArray.find(fData => {
                return fData.itemId === inventoryItems.itemId
            });
            if (foundIn) {
                foundIn.quantity = foundIn.quantity + Number(inventoryItems.quantity) * coreVal.quantity
            } else {
                finalArray.push({ 'itemId': inventoryItems.itemId, quantity: Number(inventoryItems.quantity) * coreVal.quantity });
            }
        }));

    }));
    await finalArray.map(async (fVal) => {
        const stocks = await inventoryStock.findOne({ 'itemId': fVal.itemId, 'storeId': mongoose.Types.ObjectId(orderDetails.storeId) });
        let quantity = stocks.quantity - fVal.quantity;
        await inventoryStock.update({ '_id': mongoose.Types.ObjectId(stocks._id) }, { $set: { quantity: quantity } });
    })
    const response = await salesOrder.create(request);
    return response;
};

exports.getSalesOrderList = async () => {
    const response = await salesOrder.find()
        .populate({ path: 'userId', select: { 'name': 1 } })
        .populate({ path: 'orderId', populate: { path: 'customerId' } })
    return response;
};

exports.createRequisition = async (request) => {
    const response = await requisition.create(request);
    return response;
};
exports.getRequisitions = async (storeId) => {
    const response = await requisition
        .find({ storeId: mongoose.Types.ObjectId(storeId) })
        .sort({ createdAt: -1 })
        .populate({ path: 'requisitioner' })
        .populate({ path: 'authoriser' })
        .populate({ path: 'items.id' })
    return response;
};
exports.getPendingRequisitions = async () => {
    const response = await requisition.count({ status: "PENDING" });
    return response;
};
exports.updateRequisition = async (request, id) => {
    var update = { status: request.status, authoriser: mongoose.Types.ObjectId(request.authoriser) };
    if (request.reason) {
        update.reason = request.reason;
    }
    if (request.po) {
        update.po = request.po;
    }

    const response = await requisition.findOneAndUpdate({ '_id': mongoose.Types.ObjectId(id) },
        { $set: update });
    return response;
};

exports.updatePO = async (id, po) => {
    var update = { status: po.status, approver: po.approver }
    if (po.changeRequest) {
        update.changeRequest = po.changeRequest
    }
    if (po.reason) {
        update.reason = po.reason
    }
    const response = await purchaseOrder.update({ _id: mongoose.Types.ObjectId(id) }, {
        $set: po
    }, { new: true });
    return response;
};