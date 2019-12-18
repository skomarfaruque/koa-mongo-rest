const mongoose = require("mongoose");
/*
   Announcement Schema
*/
const variables = require("../variables");
const allSchemas = require(variables.schemaDirectory);

const announcementSchema = (mongoose.Schema = allSchemas.announcements);
module.exports = mongoose.model("announcements", announcementSchema);
