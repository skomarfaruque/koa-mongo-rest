"use strict";
module.exports = async(ctx, error) => {
  switch (error.status){
      case 400:
      ctx.response.badRequest(null, error.message);
          break;
      case 401:
      ctx.response.unauthorized(null, 'Authentication Failed');
      case 404:
      ctx.response.notFound(null, error.message);
          break;
      case 204:
      ctx.response.noContent(null, error.message);
          break;
      case 406:
      ctx.response.notAccepted(null, error.message);
          break;
      case 501:
      ctx.response.notImplemented(null, error.message);
          break;
     default:
     ctx.response.internalServerError(error.status, 'Internal Server Error');
      
  }
}

