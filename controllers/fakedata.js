"use strict";
const fakedataModel = require('../models/fakedataModel');
const validator = require('validatorjs');
const variables = require('../variables');
const errorResponseHandler = require('../middlewares/errorResponseHandler');
const stringifySafe = require("../Helpers/stringifySafe");
const mobileNumberFormat = require('../Helpers/mobileNumberFormat');
const customerModel = require('../models/customerModel');
const rules = () => (
    {
        mobile: ['required', 'regex:/(^(\\+8801|8801|01|1|008801))[1|5-9]{1}(\\d){8}$/'],
        customerId: ['required', 'regex:/^[a-f\\\d]{24}$'],
        password: ['required', `min:${variables.passwordLength}`],
        authToken: ['required']
    }
);
const getCustomerInfoByMobile = async(mobile) => {
    const customerInfo = await customerModel.getCustomerInfoByMobile({mobile});
    if (!customerInfo) {
        throw ({status: 404, message: 'Customer not found.'})
    }
    return customerInfo;
}
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
exports.insertCatProduct = async(ctx) => {
    try{
        await fakedataModel.insertCategoryProduct();
        ctx.response.ok({}, 'Sample category and product is inserted.');
    } catch (err) {
        ctx.log.error(stringifySafe(err, null, 2));
        errorResponseHandler(ctx, err);
    }
    
};
exports.createOrder = async(ctx) => {
    try{
        let mobile = ctx.params.mobile
        isValid({mobile});
        mobile = await mobileNumberFormat(mobile);
        const {_id} = await getCustomerInfoByMobile(mobile);
        await fakedataModel.placeOrder(_id);
        ctx.response.ok({}, 'Fake order has been placed.');
    } catch (err) {
        ctx.log.error(stringifySafe(err, null, 2));
        errorResponseHandler(ctx, err);
    }
    
};
