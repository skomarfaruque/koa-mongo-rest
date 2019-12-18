const mongoose = require("mongoose");
/*
   Charity Schema
*/
const variables = require("../variables");
const allSchemas = require(variables.schemaDirectory);

const charitySchema = (mongoose.Schema = allSchemas.charities);
module.exports = mongoose.model("charities", charitySchema);
