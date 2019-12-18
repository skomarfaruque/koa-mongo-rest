const mongoose = require("mongoose");
/*
   Accounts Schema
*/
const variables = require("../variables");
const allSchemas = require(variables.schemaDirectory);

const deliverySchema = (mongoose.Schema = allSchemas.delivery);
module.exports = mongoose.model("deliveries", deliverySchema);
