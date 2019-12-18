const mongoose = require('mongoose');
/*
   inventory stock schema
*/
const variables = require('../variables');
const {inventoryStock} = require(variables.schemaDirectory)

const inventorySchema = mongoose.Schema = inventoryStock;

module.exports = mongoose.model("inventorystocks", inventorySchema);