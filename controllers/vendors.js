"use strict";
const vendorModel = require('../models/vendorModel');
const errorResponseHandler = require('../middlewares/errorResponseHandler');
const validator = require('validatorjs');
const stringifySafe = require("../Helpers/stringifySafe");
const rules = () => (
    {
        orderId: ['required', 'regex:/^[a-f\\\d]{24}$'],
        processedBy: ['required', 'regex:/^[a-f\\\d]{24}$'],
        orderStatus: ['required']
    }
);

const isValid = (req) => {
    let expectedRules = {};
    const requestedData = new Map(Object.entries(req));
    requestedData.forEach((data, key) => {
        if (key in rules() === true) {
            Object.assign(expectedRules, {[key]: rules()[key]});
        }
      });
    const validation = new validator(req, expectedRules);
    if(!validation.passes()) {
        throw ({status: 400, message: 'Invalid Input.', data: validation.errors.all()})
    };
};
exports.addVendor = async(ctx) => {
    try{
        const body = ctx.request.body;
        const response = await vendorModel.create(body);
        ctx.response.ok(response, "ok");
    } catch (err) {
        ctx.log.error(stringifySafe(err, null, 2));
        errorResponseHandler(ctx, err);
    }
};
exports.updateVendor = async(ctx) => {
    try{
        const body = ctx.request.body;
        const vendorId = ctx.params.id;
        let response = await vendorModel.updateVendor(body, vendorId);
        ctx.response.ok(response, "ok");
    } catch (err) {
        ctx.log.error(stringifySafe(err, null, 2));
        errorResponseHandler(ctx, err);
    }
};
exports.vendorList = async(ctx) => {
    try{
        let response = await vendorModel.getList({'isDeleted': false});
        ctx.response.ok(response, "ok");
    } catch (err) {
        ctx.log.error(stringifySafe(err, null, 2));
        errorResponseHandler(ctx, err);
    }
};
