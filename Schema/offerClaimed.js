const mongoose = require("mongoose");
/*
   Accounts Schema
*/
const variables = require("../variables");
const allSchemas = require(variables.schemaDirectory);

const claimedSchema = (mongoose.Schema = allSchemas.offerClaimed);
module.exports = mongoose.model("claims", claimedSchema);
