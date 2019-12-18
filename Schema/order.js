const mongoose = require('mongoose');
/*
   Order Schema
*/
const variables = require('../variables');
const {orders} = require(variables.schemaDirectory)

const orderSchema = mongoose.Schema = orders;

module.exports = mongoose.model("orders", orderSchema);