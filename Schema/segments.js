const mongoose = require("mongoose");
/*
   Accounts Schema
*/
const variables = require("../variables");
const allSchemas = require(variables.schemaDirectory);

const segmentsSchema = (mongoose.Schema = allSchemas.segments);
module.exports = mongoose.model("segments", segmentsSchema);
