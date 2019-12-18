"use strict";
const charity = require("../Schema/charity");
exports.create = async request => {
  const response = await charity.create(request);
  return response;
};
