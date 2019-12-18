"use strict";
const category = require('../Schema/category');
const product = require('../Schema/product');
const productStore = require('../Schema/productStore');
const mongoose = require('mongoose');
exports.create = async (request) => {
    const response = await category.create(request);
    return response;
};
exports.getList = async (storeId) => {
    const response = await category.aggregate([
        {
            $lookup:
            {
                from: "products",
                localField: "_id",
                foreignField: "categoryId",
                as: "products"
            }
        },
        { $project: { 'createdAt': 0, 'updatedAt': 0, '__v': 0 } }

    ]);
    let responseData = JSON.parse(JSON.stringify(response));
    await Promise.all(responseData.map(async (mData) => {
        let tempArray = []
        await Promise.all(
            mData.products.map(async (pro) => {
                let checkStoreBinding = await productStore.findOne({ 'productId': mongoose.Types.ObjectId(pro._id), 'storeId': mongoose.Types.ObjectId(storeId) });
                if (checkStoreBinding) {
                    if (pro.addons.length) {
                        let addonArray = []
                        await Promise.all(pro.addons.map(async (addonVal) => {
                            let addonData = await product.findOne({ '_id': mongoose.Types.ObjectId(addonVal.id) })
                                .select({ "name": 1, "price": 1 });
                            let newAddonData = JSON.parse(JSON.stringify(addonData))
                            newAddonData.id = newAddonData._id;
                            // delete newAddonData._id
                            addonArray.push(newAddonData);
                        }))
                        pro.addons = addonArray
                    }
                    tempArray.push(pro)
                }
            })
        );
        mData.products = tempArray
        console.clear();
        console.log("\n\n\n", mData)
    }));

    return responseData;
};
exports.getListExceptPos = async (storeId) => {
    const response = await category.aggregate([
        {
            $lookup:
            {
                from: "products",
                localField: "_id",
                foreignField: "categoryId",
                as: "products"
            }
        },
        {
            $match: {
                "products.posOnly": false
            }
        },
        { $project: { 'createdAt': 0, 'updatedAt': 0, '__v': 0 } }

    ]);
    let responseData = JSON.parse(JSON.stringify(response));
    await Promise.all(responseData.map(async (mData) => {
        let tempArray = []
        await Promise.all(
            mData.products.map(async (pro) => {
                if (!pro.posOnly) {
                    let checkStoreBinding = await productStore.findOne({ 'productId': mongoose.Types.ObjectId(pro._id), 'storeId': mongoose.Types.ObjectId(storeId) });
                    if (checkStoreBinding) {
                        if (pro.addons.length) {
                            let addonArray = []
                            await Promise.all(pro.addons.map(async (addonVal) => {
                                let addonData = await product.findOne({ '_id': mongoose.Types.ObjectId(addonVal.id) })
                                    .select({ "name": 1, "price": 1 });
                                let newAddonData = JSON.parse(JSON.stringify(addonData))
                                newAddonData.id = newAddonData._id;
                                // delete newAddonData._id
                                addonArray.push(newAddonData);
                            }))
                            pro.addons = addonArray
                        }
                        tempArray.push(pro)
                    }
                }
            })
        );
        mData.products = tempArray
    }));

    return responseData;
};
exports.getProductListByCategory = async (categoryId) => {
    const response = await product.find({ categoryId })
        .populate({ path: 'categoryId', select: { 'createdAt': 0, 'updatedAt': 0, '__v': 0 } })
        .select({ 'createdAt': 0, 'updatedAt': 0, '__v': 0 }).sort('-createdAt');
    return response;
};
exports.productByStoreAndCat = async (categoryId, storeId) => {
    const response = await product.find({ categoryId, storeId })
        .populate({ path: 'categoryId', select: { 'createdAt': 0, 'updatedAt': 0, '__v': 0 } })
        .select({ 'createdAt': 0, 'updatedAt': 0, '__v': 0 }).sort('-createdAt');
    return response;
};
exports.getCatList = async () => {
    const response = await category.find()
        .select({ 'createdAt': 0, 'updatedAt': 0, '__v': 0 }).sort('-createdAt');
    return response;
};