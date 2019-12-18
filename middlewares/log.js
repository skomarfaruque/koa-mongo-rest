"use strict";

const useragent = require("useragent");

function agentSerializer(userAgent) {
  const agent = useragent.parse(userAgent);
  return {
    browser: agent.toAgent(),
    os: agent.os.toString(),
    device: agent.device.toString()
  };
}

function reqSerializer(ctx = {}) {
  return {
    method: ctx.method,
    url: ctx.url,
    headers: ctx.headers,
    protocol: ctx.protocol,
    ip: ctx.ip,
    query: ctx.query
  };
}

function resSerializer(ctx = {}) {
  return {
    statusCode: ctx.status,
    responseTime: ctx.responseTime,
    headers: (ctx.response || {}).headers
  };
}

function logRequest(ctx, agent) {
  switch (ctx.method) {
    case "GET":
      ctx.log.info({ agent, req: ctx, event: "request" }, "request start");
      break;
    case "POST":
      ctx.log.info(
        { agent, req: ctx, event: "request", body: ctx.request.body },
        "request start"
      );
      break;
    default:
      ctx.log.info({ agent, req: ctx, event: "request" }, "request start");
  }
}

function logResponse(ctx) {
  if (ctx.res.statusCode >= 200 && ctx.res.statusCode < 300) {
    ctx.log.info(
      { res: ctx, event: "response", body: ctx.response.body },
      "request end"
    );
  } else if (ctx.res.statusCode === 500) {
    ctx.log.error(
      { res: ctx, event: "response", body: ctx.response.body },
      "request end"
    );
  } else {
    ctx.log.warn(
      { res: ctx, event: "response", body: ctx.response.body },
      "request end"
    );
  }
}

/**
 * Return middleware that attachs logger to context and
 * logs HTTP request/response.
 * @param {Object} options - Optional configuration
 * @param {String} options.logger - Logger instance of bunyan
 * @return {Function} - Koa middleware
 */
function log(options = {}) {
  const { logger = null } = options;

  if (!logger) throw new TypeError("Logger required");

  return async (ctx, next) => {
    const startTime = new Date();
    ctx.log = logger.child({ reqId: ctx.reqId });
    ctx.log.addSerializers({
      req: reqSerializer,
      res: resSerializer,
      agent: agentSerializer
    });

    const agent = ctx.get("User-Agent");

    logRequest(ctx, agent);

    await next();

    ctx.responseTime = new Date() - startTime;

    logResponse(ctx);
  };
}

module.exports = log;
