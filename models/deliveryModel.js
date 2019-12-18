"use strict";
const DeliverySettings = require("../Schema/deliverySettings");
const Delivery = require("../Schema/delivery");
const Coupons = require("../Schema/coupons");
const Campaigns = require("../Schema/campaigns");
const products = require("../Schema/product");
const categories = require("../Schema/category");
const stores = require("../Schema/store");
const customers = require("../Schema/customer");
const Claims = require("../Schema/offerClaimed");
const orders = require("../Schema/order");
const mongoose = require("mongoose");

exports.checkAvailability = async (storeId, request) => {
  var where = {
    storeId: mongoose.Types.ObjectId(storeId),
    minimumOrder: { $lte: Number(request.orderTotal) }
  }
  const response = await DeliverySettings.count(where);
  if (response) {
    return { eligible: true };
  }
  return { eligible: false };
};


exports.create = async request => {
  const response = await Delivery.create(request);
  return response;
};

exports.createOption = async request => {
  const response = await DeliverySettings.create(request);
  return response;
};

exports.updateStatus = async request => {
  const status = request.status.toUpperCase();
  var where = {
    order: mongoose.Types.ObjectId(request.orderId)
  }
  var updates = { status: status };
  if (status === "DELIVERING") {
    updates.acceptedOn = new Date();
  } else if (status === "DELIVERED") {
    updates.deliveredOn = new Date();
  } else if (status === "CANCELED") {
    updates.canceledOn = new Date();
    updates.comments = request.comments;
  }
  const response = await Delivery.findOneAndUpdate(where, updates, { new: true });
  return response;
};

exports.deliveryList = async request => {
  const response = await Delivery.find().populate({ path: "order" }).populate({ path: "store" }).populate({ path: "customer" }).populate({ path: "rider" });
  return response;
};

exports.deliveriesByStore = async (id) => {
  var where = {
    store: mongoose.Types.ObjectId(id)
  }
  const response = await Delivery.find(where).populate({ path: "order" }).populate({ path: "store" }).populate({ path: "customer" }).populate({ path: "rider" });
  return response;
}

exports.deliveriesByRider = async (id) => {
  var where = {
    rider: mongoose.Types.ObjectId(id)
  }
  const response = await Delivery.find(where).populate({ path: "order" }).populate({ path: "store" }).populate({ path: "customer" }).populate({ path: "rider" });
  return response;
}