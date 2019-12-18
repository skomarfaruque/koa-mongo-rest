const mongoose = require('mongoose');
/*
   Vendor Schema
*/
const variables = require('../variables');
const allSchemas = require(variables.schemaDirectory)

const vendorSchema = mongoose.Schema = allSchemas.vendors;
module.exports = mongoose.model("vendors", vendorSchema);