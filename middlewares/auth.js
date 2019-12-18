const variables = require("../variables");
exports.isAuthorized = function(ctx, next) {
    if (variables.apiToken !== ctx.request.header.apitoken) {
        return ctx.response.badRequest();
    }
    return next();
};