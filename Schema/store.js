const mongoose = require('mongoose');
/*
    Store Schema
*/
const variables = require('../variables');
const {stores} = require(variables.schemaDirectory)

const storeSchema = mongoose.Schema = stores;

module.exports = mongoose.model("stores", storeSchema);