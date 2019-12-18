"use strict";
const feedbackModel = require('../models/feedbackModel');
const customerModel = require('../models/customerModel');
const notificationModel = require('../models/notificationModel');
const orderModel = require('../models/orderModel');
const validator = require('validatorjs');
const errorResponseHandler = require('../middlewares/errorResponseHandler');
const stringifySafe = require("../Helpers/stringifySafe");
const rules = () => (
    {
        title: ['required'],
        orderId: ['required', 'regex:/^[a-f\\\d]{24}$'],
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
        throw ({status: 400, message: 'Invalid Input.', data: validation.errors.all()});
    };
};
exports.addQuestions = async(ctx) => {
    try{
        const body = ctx.request.body;
        isValid(body);
        await feedbackModel.create(body);
        ctx.response.ok({}, 'Question is added successfully.');
    } catch (err) {
        ctx.log.error(stringifySafe(err, null, 2));
        errorResponseHandler(ctx, err);
    }
};
exports.updateQuestion = async(ctx) => {
    try{
        const body = ctx.request.body;
        const questionId = ctx.params.id;
        const res = await feedbackModel.updateQuestion(body,questionId);
        ctx.response.ok(res, 'Question is upated successfully.');
    } catch (err) {
        ctx.log.error(stringifySafe(err, null, 2));
        errorResponseHandler(ctx, err);
    }
};
exports.deletQuestion = async(ctx) => {
    try{
        const res = await feedbackModel.deleteQuestion(ctx.params.id);
        ctx.response.ok({}, 'Question has been delete successfully.');
    } catch (err) {
        ctx.log.error(stringifySafe(err, null, 2));
        errorResponseHandler(ctx, err);
    }
};
exports.addFeedbackAnswers = async(ctx) => {
    try{
        const body = ctx.request.body;
        isValid({orderId: ctx.params.orderId});
        let postObject = {orderId: ctx.params.orderId, answers:body}
        await feedbackModel.addAnswer(postObject);
        ctx.response.ok({}, 'Thank you for your kind review.');
    } catch (err) {
        ctx.log.error(stringifySafe(err, null, 2));
        errorResponseHandler(ctx, err);
    }
};
exports.questionLists = async(ctx) => {
    try{
        const categoryResponse = await feedbackModel.getList();
        ctx.response.ok(categoryResponse, 'Questions list');
    } catch (err) {
        ctx.log.error(stringifySafe(err, null, 2));
        errorResponseHandler(ctx, err);
    }
};
exports.sendFeedbackRequest = async(ctx) => {
    try{
        const body = ctx.request.body;
        const customerInfo =  await customerModel.getCustomerInfoById(body.customerId);
        const requestFeedback =  await notificationModel.sendFeedbackPushToCustomer(customerInfo.deviceToken, body.orderId);
        if (requestFeedback.status) {
            await orderModel.updateById({feedbackRequested: true}, body.orderId);
        }
        ctx.response.ok(null, 'Success');
    } catch (err) {
        ctx.log.error(stringifySafe(err, null, 2));
        errorResponseHandler(ctx, err);
    }
};
