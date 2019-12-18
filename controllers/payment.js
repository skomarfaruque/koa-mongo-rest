"use strict";
const paymentModel = require("../models/payment");
const errorResponseHandler = require("../middlewares/errorResponseHandler");
const stringifySafe = require("../Helpers/stringifySafe");
const { paymentProfile } = require('../variables/index');
const uuid = require('uuid/v4');
var generateTxnId = () => {
  var date = new Date();
  return date.getTime();
}
exports.initiate = async ctx => {
  try {
    var body = ctx.request.body;
    body.store_id = paymentProfile.id;
    body.store_passwd = paymentProfile.password;
    body.currency = paymentProfile.currency;
    body.tran_id = generateTxnId();
    body.success_url = paymentProfile.notifyURL;
    body.fail_url = paymentProfile.notifyURL;
    body.cancel_url = paymentProfile.notifyURL;
    body.emi_option = 0;
    body.txn_flow = "REQUESTED";
    if (!body.cus_email) {
      body.cus_email = paymentProfile.defaultEmail;
    }
    const response = await paymentModel.initiate(paymentProfile.paymentURL, body);
    ctx.response.ok(response, "ok");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};

exports.callback = async ctx => {
  var body = ctx.request.body;
  const response = await paymentModel.callback(body);
  ctx.response.ok({}, "ok");
};
exports.details = async ctx => {
  try {
    var session_id = ctx.params.id;
    const response = await paymentModel.details(session_id);
    ctx.response.ok(response, "ok");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};