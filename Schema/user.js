const mongoose = require('mongoose');
/*
    User Schema
*/
const variables = require('../variables');
const {users} = require(variables.schemaDirectory)

const userSchema = mongoose.Schema = users;
module.exports = mongoose.model("users", userSchema);