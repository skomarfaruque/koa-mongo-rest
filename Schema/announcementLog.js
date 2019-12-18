const mongoose = require("mongoose");
/*
   Announcement Logs Schema
*/
const variables = require("../variables");
const allSchemas = require(variables.schemaDirectory);

const announcementLogSchema = (mongoose.Schema = allSchemas.announcementLogs);
module.exports = mongoose.model("announcementlogs", announcementLogSchema);
