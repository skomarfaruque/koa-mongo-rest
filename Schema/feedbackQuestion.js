const mongoose = require('mongoose');
const variables = require('../variables');
const allSchemas = require(variables.schemaDirectory)

const feedbackQuestion = mongoose.Schema = allSchemas.feedbackQuestion;
module.exports = mongoose.model("feedbackquestion", feedbackQuestion);