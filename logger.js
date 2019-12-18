"use strict";

const bunyan = require("bunyan");
const variables = require("./variables");


const loggerConfig = {
  name: variables.loggerName,
  streams: [
    {
      type: "stream",
      stream: process.stdout,
      level: variables.logLevel
    }

  ]
};

const logger = bunyan.createLogger(loggerConfig);
module.exports = logger;
