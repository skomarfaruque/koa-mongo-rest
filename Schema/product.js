const mongoose = require('mongoose');
/*
   Product Schema
*/
const variables = require('../variables');
const allSchemas = require(variables.schemaDirectory)

const productSchema = mongoose.Schema = allSchemas.productSchema;
module.exports = mongoose.model("products", productSchema);