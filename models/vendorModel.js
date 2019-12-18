"use strict";
const vendor = require('../Schema/vendor');
const mongoose = require('mongoose');
exports.create = async(request) => {
    const response = await vendor.create(request);
    return response;
};
exports.updateVendor = async(request, id) => {
    const response = await vendor.findOneAndUpdate({'_id': mongoose.Types.ObjectId(id)}, { $set: request}, { new: true });
    return response;
};
exports.getList = async(r) => {
    const response = await vendor.find({'isDeleted': false}).select({'isDeleted': 0, '__v': 0});

    return response;
};
