"use strict";
const orderModel = require("../models/orderModel");
const sqsModel = require("../models/sqs");
const errorResponseHandler = require("../middlewares/errorResponseHandler");
const validator = require("validatorjs");
const stringifySafe = require("../Helpers/stringifySafe");
const rules = () => ({
  orderId: ["required", "regex:/^[a-f\\d]{24}$"],
  processedBy: ["required", "regex:/^[a-f\\d]{24}$"],
  orderStatus: ["required"]
});

const isValid = req => {
  let expectedRules = {};
  const requestedData = new Map(Object.entries(req));
  requestedData.forEach((data, key) => {
    if (key in rules() === true) {
      Object.assign(expectedRules, { [key]: rules()[key] });
    }
  });
  const validation = new validator(req, expectedRules);
  if (!validation.passes()) {
    throw {
      status: 400,
      message: "Invalid Input.",
      data: validation.errors.all()
    };
  }
};
exports.orderDetailsById = async ctx => {
  try {
    const orderResponse = await orderModel.getOrderDetailsByid(ctx.params.id);
    ctx.response.ok(orderResponse, "ok");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};
exports.processUpdateOrder = async ctx => {
  try {
    let body = ctx.request.body;
    body.orderId = ctx.params.id;
    isValid(body);
    await orderModel.addOrderProcessHistory(body);
    const orderResponse = await orderModel.updateOrderByOrderId(body);
    ctx.response.ok(orderResponse, "ok");

    if (Number(body.orderStatus) === 2) {
      ctx.sqs = {
        userid: orderResponse.customerId,
        orderid: orderResponse._id
      };
      const result = await sqsModel.createSalesOrder(ctx);
    }
    if (Number(body.orderStatus) === 3) {
      ctx.sqs = {
        customerid: orderResponse.customerId,
        orderid: orderResponse._id
      };
      const result = await sqsModel.requestFeedback(ctx);
    }
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};
