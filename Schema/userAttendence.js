const mongoose = require('mongoose');
/*
    User attendence Schema
*/
const variables = require('../variables');
const {userAttendences} = require(variables.schemaDirectory)

const userAttendenceSchema = mongoose.Schema = userAttendences;
module.exports = mongoose.model("userattendences", userAttendenceSchema);