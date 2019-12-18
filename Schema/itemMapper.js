const mongoose = require('mongoose');
/*
   Item mapper 
*/
const variables = require('../variables');
const allSchemas = require(variables.schemaDirectory)

const itemMapperSchema = mongoose.Schema = allSchemas.itemMapper;
module.exports = mongoose.model("itemmappers", itemMapperSchema);