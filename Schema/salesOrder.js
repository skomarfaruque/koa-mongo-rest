const mongoose = require('mongoose');
/*
   sales order
*/
const variables = require('../variables');
const {salesOrders} = require(variables.schemaDirectory)

const salesOrderSchema = mongoose.Schema = salesOrders;

module.exports = mongoose.model("salesorders", salesOrderSchema);