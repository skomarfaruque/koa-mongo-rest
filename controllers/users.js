"use strict";
const userModel = require('../models/userModel');
const errorResponseHandler = require('../middlewares/errorResponseHandler');
const stringifySafe = require("../Helpers/stringifySafe");
const validator = require('validatorjs');
const rules = () => (
    {
        email: ['required', 'email'],
        password: ['required']
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
exports.login = async (ctx) => {
    try {
        const body = ctx.request.body;
        isValid(body);
        body.email = body.email.toLowerCase();
        const getUserInfo = await userModel.login(body);
        if (!getUserInfo) {
            throw ({ status: 400, message: 'Login Failed.' })
        }
        await userModel.updateDevicetoken({ deviceToken: body.token, id: getUserInfo._id });
        await userModel.attendanceUser({ storeId: getUserInfo.storeId ? getUserInfo.storeId : null, userId: getUserInfo._id, status: 'Login' });
        ctx.response.ok(getUserInfo, 'Login success.');
    } catch (err) {
        ctx.log.error(stringifySafe(err, null, 2));
        errorResponseHandler(ctx, err);
    }

};
exports.logOut = async (ctx) => {

    try {
        const body = ctx.request.body;
        const response = await userModel.attendanceUser({ storeId: body.storeId ? body.storeId : null, userId: body.userId, status: 'Logout' });
        ctx.response.ok(response, 'Logout success.');
    } catch (err) {
        ctx.log.error(stringifySafe(err, null, 2));
        errorResponseHandler(ctx, err);
    }

};
exports.create = async (ctx) => {
    try {
        const response = await userModel.create(ctx.request.body);
        ctx.response.ok(response, 'User created.');
    } catch (err) {
        ctx.log.error(stringifySafe(err, null, 2));
        errorResponseHandler(ctx, err);
    }

};
exports.loginHistory = async (ctx) => {
    try {
        let start = '';
        let end = '';
        if (Object.keys(ctx.request.query).length) {
            start = ctx.request.query.start;
            end = ctx.request.query.end;
        }
        const response = await userModel.loginHistory(start, end);
        ctx.response.ok(response, 'Ok.');
    } catch (err) {
        ctx.log.error(stringifySafe(err, null, 2));
        errorResponseHandler(ctx, err);
    }

};
exports.listUsers = async (ctx) => {
    try {
        if (!ctx.query.userType)
            throw { status: 400, message: "Please provide type of user" };
        var type = Number(ctx.query.userType);
        const response = await userModel.listUsers(type);
        ctx.response.ok(response, 'Ok.');
    } catch (err) {
        ctx.log.error(stringifySafe(err, null, 2));
        errorResponseHandler(ctx, err);
    }

};