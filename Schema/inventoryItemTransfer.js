const mongoose = require('mongoose');
const variables = require('../variables');
const allSchemas = require(variables.schemaDirectory)

const inventoryItemTransfersSchema = mongoose.Schema = allSchemas.inventoryItemTransfers;
module.exports = mongoose.model("inventoryitemtransfers", inventoryItemTransfersSchema);