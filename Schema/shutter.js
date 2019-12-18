const mongoose = require("mongoose");
/*
    Store Schema
*/
const variables = require("../variables");
const { shutters } = require(variables.schemaDirectory);

const shutterSchema = (mongoose.Schema = shutters);

module.exports = mongoose.model("shutters", shutterSchema);
