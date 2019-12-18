const mongoose = require('mongoose');
const variables = require('../variables');
const allSchemas = require(variables.schemaDirectory)

const availableCashSchema = mongoose.Schema = allSchemas.availableCash;
module.exports = mongoose.model("availableCash", availableCashSchema);