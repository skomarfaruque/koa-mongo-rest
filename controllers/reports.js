"use strict";
const reportModel = require('../models/reportModel');
const errorResponseHandler = require('../middlewares/errorResponseHandler');
const validator = require('validatorjs');
const stringifySafe = require("../Helpers/stringifySafe");
const rules = () => (
    {
        userId: ['required', 'regex:/^[a-f\\\d]{24}$/'],
        storeId: ['required', 'regex:/^[a-f\\\d]{24}$/']
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
        throw ({ status: 400, message: 'Invalid Input.', data: validation.errors.all() })
    };
};
exports.addDailyReport = async (ctx) => {
    try {
        const body = ctx.request.body;
        body.storeId = ctx.params.storeId
        var actionStatus = {};
        if (body.eventId !== '') {
            var response = await reportModel.updateDailyReport({ id: body.eventId, items: body.items })
        } else {
            var response = await reportModel.create(body);
        }
        actionStatus = JSON.parse(JSON.stringify(response));
        actionStatus.eventId = response._id;
        ctx.response.ok(actionStatus, "ok");
    } catch (err) {
        ctx.log.error(stringifySafe(err, null, 2));
        errorResponseHandler(ctx, err);
    }
};
exports.getDailyStockReport = async (ctx) => {
    try {
        const storeId = ctx.params.storeId;
        isValid(storeId);
        const checkExists = await reportModel.checkDailyReportRecordToday(storeId, ctx.query);
        ctx.response.ok(checkExists, "ok");
    } catch (err) {
        ctx.log.error(stringifySafe(err, null, 2));
        errorResponseHandler(ctx, err);
    }
};