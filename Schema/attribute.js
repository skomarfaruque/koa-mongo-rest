const mongoose = require('mongoose');
/*
   Product attribute Schema
*/
const variables = require('../variables');
const allSchemas = require(variables.schemaDirectory)

const productAttributeSchema = mongoose.Schema = allSchemas.productAttributes;
module.exports = mongoose.model("productattributes", productAttributeSchema);