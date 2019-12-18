"use strict";
const productModel = require('../models/productModel');
const categoryModel = require('../models/categoryModel');
const errorResponseHandler = require('../middlewares/errorResponseHandler');
const stringifySafe = require("../Helpers/stringifySafe");
const validator = require('validatorjs');
const rules = () => (
    {
        name: ['required']
    }
);
const isValid = (req) => {
    let expectedRules = {};
    const requestedData = new Map(Object.entries(req));
    requestedData.forEach((data, key) => {
        if (key in rules() === true) {
            Object.assign(expectedRules, { [key]: rules()[key] });
        }
    });
    const validation = new validator(req, expectedRules);
    if (!validation.passes()) {
        throw ({ status: 400, message: 'Invalid Input.', data: validation.errors.all() });
    };
};
exports.create = async (ctx) => {
    try {
        const body = ctx.request.body;
        const response = await productModel.create(body);
        ctx.response.ok(response, 'Product added successfully.');
    } catch (err) {
        ctx.log.error(stringifySafe(err, null, 2));
        errorResponseHandler(ctx, err);
    }
};
exports.addOrUpdateProductOptions = async (ctx) => {
    try {
        const body = ctx.request.body;
        const response = await productModel.addOrUpdateProductOptions(body);
        ctx.response.ok(response, 'Ok.');
    } catch (err) {
        ctx.log.error(stringifySafe(err, null, 2));
        errorResponseHandler(ctx, err);
    }
};
exports.list = async (ctx) => {
    try {
        const productResponse = await productModel.getList();
        ctx.response.ok(productResponse, 'ok');
    } catch (err) {
        ctx.log.error(stringifySafe(err, null, 2));
        errorResponseHandler(ctx, err);
    }
};
exports.productDetailsById = async (ctx) => {
    try {
        const productResponse = await productModel.getProductDetailsByid(ctx.params.id);
        ctx.response.ok(productResponse, 'ok');
    } catch (err) {
        ctx.log.error(stringifySafe(err, null, 2));
        errorResponseHandler(ctx, err);
    }
};
exports.productListByCategory = async (ctx) => {
    try {
        let response = []
        if (Object.keys(ctx.request.query).length) {
            response = await categoryModel.productByStoreAndCat(ctx.params.id, ctx.request.query.storeId);
        } else {
            response = await categoryModel.getProductListByCategory(ctx.params.id);
        }

        if (!response.length) {
            throw ({ status: 204, message: 'No content.' })
        }
        ctx.response.ok(response, 'ok');
    } catch (err) {
        ctx.log.error(stringifySafe(err, null, 2));
        errorResponseHandler(ctx, err);
    }
};
exports.addAttribute = async (ctx) => {
    try {
        const body = ctx.request.body;
        isValid(body)
        const response = await productModel.addAttribute(body);
        ctx.response.ok(response, 'Ok.');
    } catch (err) {
        ctx.log.error(stringifySafe(err, null, 2));
        errorResponseHandler(ctx, err);
    }
};
exports.attributeList = async (ctx) => {
    try {
        const body = ctx.request.body;
        const response = await productModel.getAttributeList(body);
        ctx.response.ok(response, 'Ok.');
    } catch (err) {
        ctx.log.error(stringifySafe(err, null, 2));
        errorResponseHandler(ctx, err);
    }
};
exports.productOptionDetails = async (ctx) => {
    try {
        const productId = ctx.params.productId;
        const response = await productModel.getOptionDetails(productId);
        ctx.response.ok(response, 'Ok.');
    } catch (err) {
        ctx.log.error(stringifySafe(err, null, 2));
        errorResponseHandler(ctx, err);
    }
};
exports.addProductItems = async (ctx) => {
    try {
        const body = ctx.request.body;
        const productId = ctx.params.productId;
        const postObj = { productId, itemId: body.itemId }
        isValid(postObj)
        const response = await productModel.addProductItemOrUpdate(postObj);
        ctx.response.ok(response, 'Ok.');
    } catch (err) {
        ctx.log.error(stringifySafe(err, null, 2));
        errorResponseHandler(ctx, err);
    }
};
exports.productItems = async (ctx) => {
    try {
        const productId = ctx.params.productId;
        isValid({ "productId": productId });
        const response = await productModel.productItemsList(productId);
        ctx.response.ok(response, 'Ok.');
    } catch (err) {
        ctx.log.error(stringifySafe(err, null, 2));
        errorResponseHandler(ctx, err);
    }
};
exports.update = async (ctx) => {
    try {
        const body = ctx.request.body;
        const response = await productModel.update(body);
        ctx.response.ok(response, 'Ok.');
    } catch (err) {
        ctx.log.error(stringifySafe(err, null, 2));
        errorResponseHandler(ctx, err);
    }
};