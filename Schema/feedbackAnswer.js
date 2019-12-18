const mongoose = require('mongoose');
const variables = require('../variables');
const allSchemas = require(variables.schemaDirectory)

const feedbackAnswer = mongoose.Schema = allSchemas.feedbackAnswer;
module.exports = mongoose.model("feedbackanswer", feedbackAnswer);