const mongoose = require("mongoose");
/*
   Accounts Schema
*/
const variables = require("../variables");
const allSchemas = require(variables.schemaDirectory);

const accountsSchema = (mongoose.Schema = allSchemas.accounts);
module.exports = mongoose.model("accounts", accountsSchema);
