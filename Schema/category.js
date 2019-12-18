const mongoose = require('mongoose');
const variables = require('../variables');
const allSchemas = require(variables.schemaDirectory)

const categorySchema = mongoose.Schema = allSchemas.categorySchema;
module.exports = mongoose.model("categories", categorySchema);