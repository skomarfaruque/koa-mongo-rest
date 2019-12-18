"use strict";
const purchaseOrder = require('../Schema/purchaseOrder');
const Accounts = require("../Schema/accounts");

exports.create = async request => {
  const response = await Accounts.create(request);
  return response;
};

exports.getList = async request => {
  const response = await Accounts.find().populate({ path: "accountant" }).populate({ path: "paidTo" }).populate({ path: "poId" }).sort({ poId: -1, })
  return response;
};
