"use strict";
const mongoose = require('mongoose');
const product = require('../Schema/product');
const productOption = require('../Schema/productOption');
const productItem = require('../Schema/productItem');
const attribute = require('../Schema/attribute');
exports.create = async (request) => {
    const response = await product.create(request);
    return response;
};
exports.addOrUpdateProductOptions = async (request) => {
    const response = await productOption.findOneAndUpdate({ "productId": mongoose.Types.ObjectId(request.productId) }, { $set: request }, { upsert: true })
    return response;
};
// exports.getList = async() => {
//     const response = await product.aggregate([
//         {
//           $lookup:
//             {
//               from: "productconfigs",
//               localField: "_id",
//               foreignField: "productId",
//               as: "productConfig"
//             }
//         },
//         {$project:{'createdAt': 0, 'updatedAt': 0, '__v': 0, 'productConfig.__v': 0, 'productConfig.createdAt': 0, 'productConfig.updatedAt': 0}},
//         { $sort: { "createdAt": -1 } },
//      ]);
//     return response;
// };
exports.getList = async () => {
    const response = await product.find().select({ createdAt: 0, updatedAt: 0, __v: 0 });
    return response;
};
exports.getProductDetailsByid = async (productId) => {
    const response = await product.findOne({ "_id": mongoose.Types.ObjectId(productId) });
    let responseData = JSON.parse(JSON.stringify(response));
    if (responseData.addons.length) {
        let addonArray = []
        await Promise.all(responseData.addons.map(async (addonVal) => {
            let addonData = await product.findOne({ '_id': mongoose.Types.ObjectId(addonVal.id) })
                .select({ "name": 1, "price": 1 });
            let newAddonData = JSON.parse(JSON.stringify(addonData))
            newAddonData.id = newAddonData._id;
            // delete newAddonData._id
            addonArray.push(newAddonData);
        }))
        responseData.addons = addonArray
    }
    return responseData;
};
exports.addProductConfig = async (request) => {
    const response = await productConfig.create(request);
    return response;
};
exports.getProductListByStore = async (storeId) => {
    const response = await product.find({ 'storeId': mongoose.Types.ObjectId(storeId) }).select({ createdAt: 0, updatedAt: 0, __v: 0 });
    return response;
};
exports.addAttribute = async (request) => {
    const response = await attribute.create(request);
    return response;
};
exports.getAttributeList = async () => {
    const response = await attribute.find().select({ createdAt: 0, updatedAt: 0, __v: 0 });;
    return response;
};
exports.getOptionDetails = async (productId) => {
    const response = await productOption.findOne({ 'productId': mongoose.Types.ObjectId(productId) })
        .populate({ path: 'productId', select: { 'createdAt': 0, 'updatedAt': 0, '__v': 0 } })
        .select({ createdAt: 0, updatedAt: 0, __v: 0 });
    return response;
};
exports.addProductItemOrUpdate = async (request) => {
    const response = await productItem.findOneAndUpdate({ "productId": mongoose.Types.ObjectId(request.productId), "itemId": mongoose.Types.ObjectId(request.itemId) }, { $set: request }, { upsert: true });
    return response;
};
exports.productItemsList = async (productId) => {
    const response = await productItem.find({ 'productId': mongoose.Types.ObjectId(productId) });
    return response;
};
exports.update = async (request) => {
    var updates = { ...request };
    delete updates._id
    const response = await product.findOneAndUpdate({ "_id": mongoose.Types.ObjectId(request._id) }, { $set: updates }, { upsert: true })
    return response;
};