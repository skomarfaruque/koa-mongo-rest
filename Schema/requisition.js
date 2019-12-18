const mongoose = require('mongoose');
/*
   purchase order
*/
const variables = require('../variables');
const { requisition } = require(variables.schemaDirectory)

const requisitionSchema = mongoose.Schema = requisition;

module.exports = mongoose.model("requisition", requisitionSchema);