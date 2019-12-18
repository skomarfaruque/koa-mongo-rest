const mongoose = require("mongoose");
/*
   Accounts Schema
*/
const variables = require("../variables");
const allSchemas = require(variables.schemaDirectory);

const campaignsSchema = (mongoose.Schema = allSchemas.campaigns);
module.exports = mongoose.model("campaigns", campaignsSchema);
