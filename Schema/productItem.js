const mongoose = require('mongoose');
/*
   Product items Schema
*/
const variables = require('../variables');
const allSchemas = require(variables.schemaDirectory)

const productItemSchema = mongoose.Schema = allSchemas.productItems;
module.exports = mongoose.model("productitems", productItemSchema);