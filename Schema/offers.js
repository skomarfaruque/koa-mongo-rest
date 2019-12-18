const mongoose = require("mongoose");
/*
   Accounts Schema
*/
const variables = require("../variables");
const allSchemas = require(variables.schemaDirectory);

const offersSchema = (mongoose.Schema = allSchemas.offers);
module.exports = mongoose.model("offers", offersSchema);
