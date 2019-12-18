const mongoose = require('mongoose');
/*
   Product options Schema
*/
const variables = require('../variables');
const allSchemas = require(variables.schemaDirectory)

const productOptionSchema = mongoose.Schema = allSchemas.productOptions;
module.exports = mongoose.model("productoptions", productOptionSchema);