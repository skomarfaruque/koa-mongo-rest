const mongoose = require('mongoose');
/*
   inventory items
*/
const variables = require('../variables');
const {inventoryItems} = require(variables.schemaDirectory)

const inventorySchema = mongoose.Schema = inventoryItems;

module.exports = mongoose.model("inventoryitems", inventorySchema);