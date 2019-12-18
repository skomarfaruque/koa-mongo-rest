"use strict";
const accouncementModel = require("../models/announcementModel");
const customerModel = require("../models/customerModel");
const userModel = require("../models/userModel");
const errorResponseHandler = require("../middlewares/errorResponseHandler");
const validator = require("validatorjs");
const moment = require("moment");
const stringifySafe = require("../Helpers/stringifySafe");
const rules = () => ({
  text: ["required"],
  validTill: ["required", "dateValidation"],
  appType: ["required", { in: ["MCOMMERCE", "POS", "KDS"] }],
  announcementLogId: ["required", "regex:/^[a-f\\d]{24}$/"],
  userId: ["required", "regex:/^[a-f\\d]{24}$/"]
});
validator.register(
  "dateValidation",
  function(value, requirement, attribute) {
    return moment(value).isSameOrAfter(moment(new Date()).format("YYYY-MM-DD"));
  },
  "Valid till date must be greater than current date."
);
const getCustomerInfoById = async id => {
  const customerInfo = await customerModel.getCustomerInfoById(id);
  if (!customerInfo) {
    throw { status: 400, message: "Customer not found." };
  }
  return customerInfo;
};
const getUserInfoById = async id => {
  const userInfo = await userModel.getUserInfoById(id);
  if (!userInfo) {
    throw { status: 400, message: "User not found." };
  }
  return userInfo;
};
const getAnnouncementLogInfoById = async id => {
  const announcementLogInfo = await accouncementModel.getAnnouncementLogInfo(
    id
  );
  if (!announcementLogInfo) {
    throw { status: 400, message: "Announcement log not found." };
  }
  return announcementLogInfo;
};
const isValid = req => {
  let expectedRules = {};
  const requestedData = new Map(Object.entries(req));
  requestedData.forEach((data, key) => {
    if (key in rules() === true) {
      Object.assign(expectedRules, { [key]: rules()[key] });
    }
  });
  const validation = new validator(req, expectedRules);
  if (!validation.passes()) {
    throw {
      status: 400,
      message: "Invalid Input.",
      data: validation.errors.all()
    };
  }
};
exports.add = async ctx => {
  try {
    const body = ctx.request.body;
    isValid(body);
    const response = await accouncementModel.create(body);
    ctx.response.ok(response, "ok");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};
exports.list = async ctx => {
  try {
    let appType = ''
    if (ctx.request.query.app) {
      appType = ctx.request.query.app;
      isValid({appType})
    } else {
      appType = 'ALL'
    }
    
    const response = await accouncementModel.getList(appType);
    ctx.response.ok(response, "ok");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};
exports.updateAnnouncementLogById = async ctx => {
  try {
    const logId = ctx.params.id;
    isValid({ announcementLogId: logId });
    await getAnnouncementLogInfoById(logId);
    const response = await accouncementModel.updateLog(logId);
    ctx.response.ok(response, "ok");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};
exports.getUsersAnncouncements = async ctx => {
  try {
    const userId = ctx.params.userId;
    const appType = ctx.request.query.app;
    isValid({ userId: userId });
    if (appType === "MCOMMERCE") {
      await getCustomerInfoById(userId);
    } else {
      const userInfo = await getUserInfoById(userId);
      if (appType === "KDS") {
        if (userInfo.userType !== 3 && userInfo.userType !== 4) {
          throw { status: 400, message: "Invalid input." };
        }
      } else {
        if (userInfo.userType !== 2 && userInfo.userType !== 4) {
          throw { status: 400, message: "Invalid input." };
        }
      }
    }
    const response = {};
    const getAccouncementByAppType = await accouncementModel.getAccouncementByAppType(
      appType
    );
    if (getAccouncementByAppType) {
      const checkAlreadyDelivered = await accouncementModel.checkAlreadyDelivered(
        { userId, announcementId: getAccouncementByAppType._id }
      );
      if (checkAlreadyDelivered) {
        if (!checkAlreadyDelivered.dismissedOn) {
          response._id = checkAlreadyDelivered._id;
          response.text = getAccouncementByAppType.text;
        }
      } else {
        const addLog = await accouncementModel.addLog({
          announcement: getAccouncementByAppType._id,
          externalModelType: appType === "MCOMMERCE" ? "customers" : "users",
          user: userId
        });
        response._id = addLog._id;
        response.text = getAccouncementByAppType.text;
      }

      ctx.response.ok(response._id ? response : null, "ok");
    } else {
      ctx.response.ok(null, "No Announcement found.");
    }
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};
