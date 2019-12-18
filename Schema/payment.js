const mongoose = require("mongoose");
/*
   Payment Schema
*/
const variables = require("../variables");
const allSchemas = require(variables.schemaDirectory);

const paymentSchema = (mongoose.Schema = allSchemas.payment);
module.exports = mongoose.model("payment", paymentSchema);
