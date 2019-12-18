const mongoose = require('mongoose');
/*
   inventory stock schema
*/
const variables = require('../variables');
const {productStores} = require(variables.schemaDirectory)

const productStoresSchema = mongoose.Schema = productStores;

module.exports = mongoose.model("productstores", productStoresSchema);