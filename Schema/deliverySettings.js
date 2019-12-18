const mongoose = require("mongoose");
/*
   Accounts Schema
*/
const variables = require("../variables");
const allSchemas = require(variables.schemaDirectory);

const deliverySettingsSchema = (mongoose.Schema = allSchemas.deliverySettings);
module.exports = mongoose.model("deliverySettings", deliverySettingsSchema);
