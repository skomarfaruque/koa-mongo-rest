const mongoose = require('mongoose');
/*
   Daily stocks report
*/
const variables = require('../variables');
const {dailyStocksReport} = require(variables.schemaDirectory)

const dailyStocksReportSchema = mongoose.Schema = dailyStocksReport;

module.exports = mongoose.model("dailystocksreports", dailyStocksReportSchema);