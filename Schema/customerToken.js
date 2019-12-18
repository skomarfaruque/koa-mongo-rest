const mongoose = require('mongoose');
/*
    Customer auth token Schema
*/
const variables = require('../variables');
const {customerToken} = require(variables.schemaDirectory)

const authTokenSchema = mongoose.Schema = customerToken;

module.exports = mongoose.model("customerauthtoken", authTokenSchema);