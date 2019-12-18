const mongoose = require('mongoose');
/*
    Customer Schema
*/
const variables = require('../variables');
const {customers} = require(variables.schemaDirectory)

const customerSchema = mongoose.Schema = customers;
module.exports = mongoose.model("customer", customerSchema);