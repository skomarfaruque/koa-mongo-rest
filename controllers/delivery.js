"use strict";
const deliveryModel = require("../models/deliveryModel");
const errorResponseHandler = require("../middlewares/errorResponseHandler");
const stringifySafe = require("../Helpers/stringifySafe");

exports.createItem = async ctx => {
  try {
    const body = ctx.request.body;
    if (!body.order) throw { status: 400, message: "Invalid Order ID" };
    if (!body.rider) throw { status: 400, message: "Invalid Rider ID" };
    const response = await deliveryModel.create(body);
    ctx.response.ok(response, "ok");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};

exports.createOption = async ctx => {
  try {
    const body = ctx.request.body;
    if (!body.storeId) throw { status: 400, message: "Invalid Store ID" };
    if (!body.minimumOrder || isNaN(body.minimumOrder) || body.minimumOrder < 0) throw { status: 400, message: "Invalid input" };
    const response = await deliveryModel.createOption(body);
    ctx.response.ok(response, "ok");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};

exports.availability = async ctx => {
  try {
    const storeId = ctx.params.storeId;
    const body = ctx.request.query;
    const response = await deliveryModel.checkAvailability(storeId, body);
    ctx.response.ok(response, "ok");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};

exports.updateStatus = async ctx => {
  try {
    const body = ctx.request.body;
    const response = await deliveryModel.updateStatus(body);
    ctx.response.ok(response, "ok");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};

exports.deliveryList = async ctx => {
  try {
    const response = await deliveryModel.deliveryList();
    ctx.response.ok(response, "ok");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};

exports.deliveryListByStore = async ctx => {
  try {
    const id = ctx.params.id;
    const response = await deliveryModel.deliveriesByStore(id);
    ctx.response.ok(response, "ok");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};

exports.deliveryListByRider = async ctx => {
  try {
    const id = ctx.params.id;
    const response = await deliveryModel.deliveriesByRider(id);
    ctx.response.ok(response, "ok");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};