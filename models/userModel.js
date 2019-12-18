const user = require("../Schema/user");
const userAttendence = require("../Schema/userAttendence");
const passwordHash = require("../Helpers/passwordHash");
const mongoose = require("mongoose");
exports.login = async request => {
  request.password = await passwordHash(request.password);
  const response = await user
    .findOne({ email: request.email, password: request.password })
    .populate("storeId")
    .select("name userType email storeId role");
  return response;
};
exports.create = async request => {
  request.password = await passwordHash(request.password);
  let response = await user.create(request);
  return response;
};
exports.updateDevicetoken = async request => {
  const token = request.deviceToken;
  const response = await user.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(request.id) },
    { deviceToken: token },
    { new: true }
  );
  return response;
};
exports.attendanceUser = async request => {
  const response = await userAttendence.create(request);
  return response;
};
exports.loginHistory = async (start, end) => {
  const startDateRaw = new Date(start);
  const startDate = new Date(
    startDateRaw.getFullYear(),
    startDateRaw.getMonth(),
    startDateRaw.getDate()
  );
  const endDateRaw = new Date(end);
  const endDate = new Date(
    endDateRaw.getFullYear(),
    endDateRaw.getMonth(),
    endDateRaw.getDate()
  );
  const response = await userAttendence
    .find(start && end ? { createdAt: { $gte: startDate, $lte: endDate } } : {})
    .populate({
      path: "storeId",
      select: { createdAt: 0, updatedAt: 0, __v: 0 }
    })
    .populate({
      path: "userId",
      select: { password: 0, createdAt: 0, updatedAt: 0, __v: 0 }
    });
  return response;
};
exports.getUserInfoById = async userId => {
  const response = await user
    .findOne({ _id: mongoose.Types.ObjectId(userId) })
    .select(
      "name mobile deviceToken registrationType walletNumber balance gender age userType"
    );
  return response;
};
exports.listUsers = async type => {
  const response = await user
    .find({ userType: type })
    .select(
      "name email role storeId"
    );
  return response;
};