"use strict";
const apiInfo = require('../package.json');
/**
 * HTTP Status codes
 */
const statusCodes = {
  CONTINUE: 100,
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  NOT_ACCEPTED: 406,
  REQUEST_TIMEOUT: 408,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIME_OUT: 504
};

function responseHandler() {
  return async (ctx, next) => {
    ctx.response.statusCodes = statusCodes;
    ctx.statusCodes = ctx.response.statusCodes;

    ctx.response.success = (data = null, message = null) => {
      ctx.status = ctx.status < 400 ? ctx.status : statusCodes.OK;
      ctx.body = { status: "success", data, message, version: apiInfo.version };
    };

    ctx.response.fail = (data = null, message = null) => {
      ctx.status =
        ctx.status >= 400 && ctx.status < 500
          ? ctx.status
          : statusCodes.BAD_REQUEST;
      ctx.body = { status: "fail", data, message, version: apiInfo.version };
    };

    ctx.response.error = (code = null, message = null) => {
      ctx.status =
        ctx.status < 500 ? statusCodes.INTERNAL_SERVER_ERROR : ctx.status;
      ctx.body = { status: "error", code, message, version: apiInfo.version };
    };

    ctx.response.ok = (data, message) => {
      ctx.status = statusCodes.OK;
      ctx.response.success(data, message);
    };

    ctx.response.created = (data, message) => {
      ctx.status = statusCodes.CREATED;
      ctx.response.success(data, message);
    };

    ctx.response.accepted = (data, message) => {
      ctx.status = statusCodes.ACCEPTED;
      ctx.response.success(data, message);
    };

    ctx.response.noContent = (data, message) => {
      ctx.status = statusCodes.NO_CONTENT;
      ctx.response.success(data, message);
    };

    ctx.response.badRequest = (data, message) => {
      ctx.status = statusCodes.BAD_REQUEST;
      ctx.response.fail(data, message);
    };

    ctx.response.unauthorized = (data, message) => {
      ctx.status = statusCodes.UNAUTHORIZED;
      ctx.response.fail(data, message);
    };

    ctx.response.forbidden = (data, message) => {
      ctx.status = statusCodes.FORBIDDEN;
      ctx.response.fail(data, message);
    };

    ctx.response.notFound = (data, message) => {
      ctx.status = statusCodes.NOT_FOUND;
      ctx.response.fail(data, message);
    };
    ctx.response.notAccepted = (data, message) => {
      ctx.status = statusCodes.NOT_ACCEPTED;
      ctx.response.fail(data, message);
    };

    ctx.response.internalServerError = (code, message) => {
      ctx.status = statusCodes.INTERNAL_SERVER_ERROR;
      ctx.response.error(code, message);
    };

    ctx.response.notImplemented = (code, message) => {
      ctx.status = statusCodes.NOT_IMPLEMENTED;
      ctx.response.error(code, message);
    };
    await next();
  };
}

module.exports = responseHandler;
