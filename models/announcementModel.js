"use strict";
const Announcement = require("../Schema/announcement");
const AnnouncementLog = require("../Schema/announcementLog");
const mongoose = require("mongoose");
exports.create = async request => {
  const response = await Announcement.create(request);
  return response;
};
exports.updateLog = async logId => {
  const response = await AnnouncementLog.findOneAndUpdate(
    { _id: logId },
    { dismissedOn: new Date() },
    { new: true }
  );
  return response;
};
exports.getAnnouncementLogInfo = async logId => {
  const response = await AnnouncementLog.findOne({ _id: logId });
  return response;
};
exports.addLog = async request => {
  const response = await AnnouncementLog.create(request);
  return response;
};
exports.getAccouncementByAppType = async appType => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const response = await Announcement.findOne({
    appType: appType,
    validTill: { $gte: today }
  }).sort({ _id: -1, validTill: -1 });
  return response;
};
exports.checkAlreadyDelivered = async request => {
  const response = await AnnouncementLog.findOne({
    announcement: mongoose.Types.ObjectId(request.announcementId),
    user: mongoose.Types.ObjectId(request.userId)
  });
  return response;
};
exports.getList = async appType => {
  let whereCon = {};
  if (appType !== "ALL") {
    whereCon.appType = appType;
  }
  let findResponse = [];
  const response = await Announcement.find(whereCon).sort({ 'createdAt': -1 });
  if (response) {
    let rawResponse = JSON.parse(JSON.stringify(response));
    findResponse = rawResponse
    await Promise.all(
      rawResponse.map(async (aData, key) => {
        let responseObj = {};
        responseObj._id = aData._id;
        responseObj.text = aData.text;
        responseObj.appType = aData.appType;
        responseObj.validTill = aData.validTill;
        responseObj.createdAt = aData.createdAt;
        const totalShown = await AnnouncementLog.find({
          announcement: aData._id
        });
        const totalDismissed = await AnnouncementLog.find({
          announcement: aData._id,
          dismissedOn: { $ne: null }
        });
        responseObj.totalShown = totalShown.length;
        responseObj.totalDismissed = totalDismissed.length;
        findResponse[key] = responseObj
      })
    );
  }
  return findResponse;
};
