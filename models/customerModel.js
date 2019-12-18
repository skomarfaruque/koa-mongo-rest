const customer = require("../Schema/customer");
const customerToken = require("../Schema/customerToken");
const fingerPrintHelper = require("../Helpers/fingerPrint");
const passwordHash = require("../Helpers/passwordHash");
const moment = require("moment");
const mongoose = require("mongoose");
const createAuthToken = async (request, fingerPrint) => {
  const response = await customerToken.create({
    customerId: request._id,
    token: fingerPrint,
    deviceBrand: request.deviceBrand,
    deviceId: request.deviceId,
    deviceName: request.deviceName,
    deviceModel: request.deviceModel,
    deviceIsEmulator: request.deviceIsEmulator,
    deviceIsTablet: request.deviceIsTablet,
    deviceUniqueId: request.deviceUniqueId,
    expireOn: moment().add(1, "years")
  });
  return response;
};
exports.create = async request => {
  if (request.password) {
    request.password = await passwordHash(request.password);
  }

  request.walletNumber =
    "7" + parseInt((Math.random() * 9 + 1) * Math.pow(10, 15 - 1), 10);
  let response = await customer.create(request);
  if (response) {
    request._id = response._id;
    const fingerPrint = await fingerPrintHelper(request); //generates fingerprint
    response.customerToken = await createAuthToken(request, fingerPrint);
  }
  return response;
};
exports.login = async request => {
  request.password = await passwordHash(request.password);
  const response = await customer
    .findOne({ mobile: request.mobile, password: request.password });
  return response;
};
exports.socialLogin = async request => {
  const where = {}
  if (request.source === "facebook") {
    where.fbId = request.id
  }
  else if (request.source === "google") {
    where.googleId = request.id
  }
  else {
    return false
  }
  const response = await customer.findOne(where);
  return response;
};
exports.updateOrCreateAuthToken = async request => {
  const fingerPrint = await fingerPrintHelper(request); //generates fingerprint
  const getAuthToken = await customerToken.findOne({ authToken: fingerPrint });
  if (getAuthToken) {
    return fingerPrint;
  }
  const response = await createAuthToken(request, fingerPrint);
  return fingerPrint;
};

exports.userExists = async request => {
  const response = await customer.aggregate([
    {
      $lookup: {
        from: "customerauthtokens",
        localField: "_id",
        foreignField: "customerId",
        as: "tokenValues"
      }
    },
    {
      $match: { mobile: { $eq: request.mobile } }
    }
  ]);
  return response;
};
exports.getCustomerAuthTokenById = async request => {
  const token = await fingerPrintHelper(request); //generates fingerprint
  const response = await customerToken.findOne({
    token,
    customerId: request.customerId
  });
  return response;
};
exports.createNewAuthToken = async request => {
  request.token = await fingerPrintHelper(request); //generates fingerprint
  const response = await customerToken.create(request);
  return response;
};
exports.getCustomerInfoByMobile = async mobile => {
  const response = await customer
    .findOne(mobile)
    .select("name mobile registrationType walletNumber balance age gender address");
  return response;
};
exports.getCustomerInfoById = async customerId => {
  const response = await customer
    .findOne({ _id: mongoose.Types.ObjectId(customerId) })
    .select(
      "name mobile deviceToken registrationType walletNumber balance gender age address"
    );
  return response;
};
exports.getUserByAuthToken = async token => {
  const response = await customerToken.findOne({ token }).populate({
    path: "customerId",
    select: "_id name balance walletNumber mobileVerified address"
  });
  return response;
};
exports.makeUserVerifiedByUserId = async userId => {
  const response = await customer
    .findOneAndUpdate({ _id: userId }, { mobileVerified: true }, { new: true })
    .select("name mobileVerified");
  return response;
};
exports.changePassword = async (password, customerId) => {
  password = await passwordHash(password);
  const response = await customer
    .findOneAndUpdate({ _id: customerId }, { password }, { new: true })
    .select("name mobileVerified");
  return response;
};
exports.updateCustomerById = async (requestedData, customerId) => {
  if (requestedData.password) {
    requestedData.password = await passwordHash(requestedData.password);
  }
  const response = await customer
    .findOneAndUpdate(
      { _id: customerId },
      { $set: requestedData },
      { new: true }
    )
    .select("name mobileVerified");
  return response;
};
exports.updateCustomerBalance = async (balance, customerId) => {
  const response = await customer
    .findOneAndUpdate({ _id: customerId }, { balance }, { new: true })
    .select("name mobileVerified balance");
  return response;
};
exports.removeCustomerByPhone = async mobile => {
  const response = await customer
    .remove(mobile)
    .select("name mobileVerified balance");
  return response;
};
exports.updateDevicetoken = async request => {
  const token = request.deviceToken;
  const response = await customer.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(request.id) },
    { deviceToken: token },
    { new: true }
  );
  return response;
};
exports.annonymousUserAddOrUpdate = async request => {
  request.token = request.deviceToken;
  let response = await customer.findOne({ name: "anonymous" });
  if (!response) {
    response = await customer.create({ name: "anonymous" });
    if (response) {
      request._id = response._id;
      const fingerPrint = await fingerPrintHelper(request); //generates fingerprint
      response.customerToken = await createAuthToken(request, fingerPrint);
    }
  } else {
    const authToken = await customerToken.findOne({
      customerId: mongoose.Types.ObjectId(response._id)
    });
    let newResponse = JSON.parse(JSON.stringify(response));
    newResponse.customerToken = authToken;
    response = newResponse;
  }
  return response;
};
exports.update = async (customerId, customerInfo) => {
  const response = await customer.findOneAndUpdate(
    { _id: customerId }, customerInfo, { new: true }
  );
  return response;
}