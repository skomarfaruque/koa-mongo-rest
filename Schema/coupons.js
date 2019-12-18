const mongoose = require("mongoose");
/*
   Accounts Schema
*/
const variables = require("../variables");
const allSchemas = require(variables.schemaDirectory);

const couponsSchema = (mongoose.Schema = allSchemas.coupons);
module.exports = mongoose.model("coupons", couponsSchema);
