const mongoose = require('mongoose');
/*
    Order process history Schema
*/
const variables = require('../variables');
const {OrderProcessHistory} = require(variables.schemaDirectory)

const OrderProcessHistorySchema = mongoose.Schema = OrderProcessHistory;

module.exports = mongoose.model("orderprocesshistory", OrderProcessHistorySchema);