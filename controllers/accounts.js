"use strict";
const accountsModel = require("../models/accountsModel");
const customerModel = require("../models/customerModel");
const userModel = require("../models/userModel");
const errorResponseHandler = require("../middlewares/errorResponseHandler");
const stringifySafe = require("../Helpers/stringifySafe");


exports.create = async ctx => {
  try {
    const body = ctx.request.body;
    const response = await accountsModel.create(body);
    ctx.response.ok(response, "ok");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};
exports.list = async ctx => {
  try {
    const response = await accountsModel.getList();
    ctx.response.ok(response, "ok");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};