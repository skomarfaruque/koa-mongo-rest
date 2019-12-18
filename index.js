"use strict";
require("dotenv").config();

const Koa = require("koa");
const variables = require("./variables");
const logMiddleware = require("./middlewares/log");
const logger = require("./logger");
const responseHandler = require("./middlewares/responseHandler");
const router = require("./routes");
const koaBody = require("koa-body");
const mongoose = require("mongoose");
const cors = require("koa2-cors");
const app = new Koa();

mongoose.Promise = require("bluebird");
mongoose
  .connect(process.env.MONGODB, {
    socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 }
  })
  .then(response => {
    logger.info("Mongodb connected");
  })
  .catch(err => {
    logger.error(err);
  });
app.use(koaBody());
app.use(logMiddleware({ logger }));
app.use(cors({ origin: "*" }));
app.use(responseHandler());
app.use(router.routes());
app.use(router.allowedMethods());
// Start server
const server = app.listen(variables.appPort, () => {
  logger.info(
    `API server listening on ${variables.host}:${variables.appPort}, in ${
    variables.env
    }`
  );
});
// Expose app
module.exports = server;
