const mongoose = require('mongoose');
/*
   inventory stock schema
*/
const variables = require('../variables');
const {itemOptions} = require(variables.schemaDirectory)

const inventorySchema = mongoose.Schema = itemOptions;

module.exports = mongoose.model("itemoptions", inventorySchema);