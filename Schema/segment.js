const mongoose = require('mongoose');
/*
   Segment Schema
*/
const variables = require('../variables');
const allSchemas = require(variables.schemaDirectory)

const segmentSchema = mongoose.Schema = allSchemas.segment;
module.exports = mongoose.model("segments", segmentSchema);