"use strict";
const categoryModel = require('../models/categoryModel');
const offerModel = require('../models/offerModel');
const validator = require('validatorjs');
const errorResponseHandler = require('../middlewares/errorResponseHandler');
const stringifySafe = require("../Helpers/stringifySafe");
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
        isValid(body);
        const categoryResponse = await categoryModel.create(body);
        ctx.response.ok({}, 'Category is created successfully.');
    } catch (err) {
        ctx.log.error(stringifySafe(err, null, 2));
        errorResponseHandler(ctx, err);
    }
};
exports.list = async (ctx) => {
    try {
        const categoryResponse = await categoryModel.getList(ctx.params.id);
        const factors = { storeId: ctx.params.id, orderSource: 1 };
        const campaigns = await offerModel.fetchCategoryOffers(factors, categoryResponse)
        ctx.response.ok(campaigns, 'Category fetched successfully');
    } catch (err) {
        ctx.log.error(stringifySafe(err, null, 2));
        errorResponseHandler(ctx, err);
    }
};
exports.listWithoutPos = async (ctx) => {
    try {
        const categoryResponse = await categoryModel.getListExceptPos(ctx.params.id);
        const factors = { storeId: ctx.params.id, orderSource: 1 };
        const campaigns = await offerModel.fetchCategoryOffers(factors, categoryResponse)
        ctx.response.ok(campaigns, 'Category fetched successfully');
    } catch (err) {
        ctx.log.error(stringifySafe(err, null, 2));
        errorResponseHandler(ctx, err);
    }
};
exports.categoryList = async (ctx) => {
    try {
        const categoryResponse = await categoryModel.getCatList();
        ctx.response.ok(categoryResponse, 'ok.');
    } catch (err) {
        ctx.log.error(stringifySafe(err, null, 2));
        errorResponseHandler(ctx, err);
    }
};
