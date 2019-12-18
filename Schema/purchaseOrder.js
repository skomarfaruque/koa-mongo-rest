const mongoose = require('mongoose');
/*
   purchase order
*/
const variables = require('../variables');
const {purchaseOrders} = require(variables.schemaDirectory)

const purchaseOrdersSchema = mongoose.Schema = purchaseOrders;

module.exports = mongoose.model("purchaseorders", purchaseOrdersSchema);