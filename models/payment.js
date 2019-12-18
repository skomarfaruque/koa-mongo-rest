"use strict";
const paymentDB = require("../Schema/payment");
const PGW = require("../Adapters/sslcmz");
const logger = require('../logger');
const { paymentProfile } = require('../variables/index');
const md5 = require('md5');
exports.initiate = async (pgwUrl, pgwRequest) => {
  const pgwResponse = await PGW.initiate(pgwUrl, pgwRequest);
  if (pgwResponse.status === "SUCCESS") {
    var transactionData = pgwRequest;
    transactionData.status = pgwResponse.status;
    transactionData.failedreason = pgwResponse.failedreason;
    transactionData.sessionkey = pgwResponse.sessionkey;
    transactionData.GatewayPageURL = pgwResponse.GatewayPageURL;
    transactionData.product_amount = pgwRequest.total_amount;
    const res = await paymentDB.create(transactionData);
    return pgwResponse;
  } else {
    throw ({
      status: 400,
      message: pgwResponse.failedreason
    });
  }
};

exports.callback = async request => {
  var where = { tran_id: request.tran_id };
  if (request.status === "VALID") {
    var update = {
      card_type: request.card_type,
      store_amount: request.store_amount,
      card_no: request.card_no,
      bank_tran_id: request.bank_tran_id,
      card_issuer: request.card_issuer,
      card_brand: request.card_brand,
      card_issuer_country: request.card_issuer_country,
      verify_sign: request.verify_sign,
      verify_key: request.verify_key,
      currency_type: request.currency_type,
      currency_amount: request.currency_amount,
      currency_rate: request.currency_rate,
      risk_level: request.risk_level,
      risk_title: request.risk_title,
      txn_flow: "INITIATED"
    }
  } else {
    var update = {
      status: request.status,
      failedreason: request.error,
      txn_flow: "INITIATED"
    }

  }
  await paymentDB.findOneAndUpdate(where, { $set: update });
  var validateUrl = paymentProfile.validatorURL +
    "?val_id=" + request.val_id +
    "&store_id=" + paymentProfile.id +
    "&store_passwd=" + paymentProfile.password +
    "&format=json";
  const res = await PGW.validate(validateUrl);
  if (res.status === "VALID") {
    var txn_flow = "COMPLETED";
  } else {
    var txn_flow = "REJECTED";
  }
  const dbUpdate = await paymentDB.findOneAndUpdate({ tran_id: request.tran_id, total_amount: Number(request.amount), currency: request.currency }, { $set: { txn_flow: txn_flow, status: res.status, val_id: res.val_id } });
};
exports.details = async sessionkey => {
  const response = await paymentDB.findOne({ sessionkey: sessionkey });
  return response;
};
