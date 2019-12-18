"use strict";
const storeModel = require("../models/storeModel");
const userModel = require("../models/userModel");
const orderModel = require("../models/orderModel");
const validator = require("validatorjs");
const errorResponseHandler = require("../middlewares/errorResponseHandler");
const stringifySafe = require("../Helpers/stringifySafe");
const mobileNumberFormat = require("../Helpers/mobileNumberFormat");
const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");
const vairiables = require("../variables");
AWS.config.update({
  accessKeyId: vairiables.awsAccessKey,
  secretAccessKey: vairiables.awsSecretKey,
  region: vairiables.awsRegion
});
const rules = () => ({
  mobile: [
    "required",
    "regex:/(^(\\+8801|8801|01|1|008801))[1|5-9]{1}(\\d){8}$/"
  ],
  name: ["required"],
  storeId: ["required", "regex:/^[a-f\\d]{24}$/"],
  userId: ["required", "regex:/^[a-f\\d]{24}$/"],
  productId: ["required", "regex:/^[a-f\\d]{24}$/"]
});

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
const getUserInfoById = async id => {
  const userInfo = await userModel.getUserInfoById(id);
  if (!userInfo) {
    throw { status: 400, message: "User not found." };
  }
  return userInfo;
};
const getStoreInfoById = async id => {
  const getStoreInfoById = await storeModel.getStoreDetailsByid(id);
  if (!getStoreInfoById) {
    throw { status: 400, message: "Store not found." };
  }
  return getStoreInfoById;
};
exports.create = async ctx => {
  try {
    const body = ctx.request.body;
    isValid(body);
    body.mobile = await mobileNumberFormat(body.mobile);
    await storeModel.create(body);
    ctx.response.ok({}, "Store created successfully.");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};
exports.uploadFile = async ctx => {
  const file = ctx.req.file;
  var Bucket = vairiables.awsS3Bucket;
  if (ctx.query.fileType === "accounts") {
    Bucket = vairiables.awsS3AccountsBucket;
  }
  const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

  try {
    const params = {
      Bucket: Bucket,
      Body: file.buffer,
      Key: "Store/" + Date.now() + "_" + file.originalname,
      ACL: vairiables.awsS3Acl,
      ContentType: file.mimetype,
      ContentEncoding: file.encoding
    };

    const s3Request = s3.upload(params);
    const s3Promise = s3Request.promise();
    const res = await s3Promise.then(
      data => {
        return data;
      },
      error => {
        throw error.response;
      }
    );

    ctx.response.ok({ imageUrl: res.Location }, "File uploaded to S3");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};
exports.openCloseShutter = async ctx => {
  try {
    const body = ctx.request.body;
    isValid(body);
    const checkShutterStatus = await storeModel.getShutterStatus(body.storeId);
    if (checkShutterStatus) {
      if (body.isOpen) {
        if (checkShutterStatus.isOpen) {
          throw {
            status: 400,
            message: "Shutter is already opened."
          };
        }
      } else {
        if (!checkShutterStatus.isOpen) {
          throw {
            status: 400,
            message: "Shutter is already closed."
          };
        }
      }
    } else {
      if (!body.isOpen) {
        throw {
          status: 400,
          message: "Shutter is already closed."
        };
      }
    }
    const userInfo = await getUserInfoById(body.userId);
    if (userInfo.userType !== 2 && userInfo.userType !== 4) {
      throw { status: 400, message: "Invalid input." };
    }
    await getStoreInfoById(body.storeId);
    const response = await storeModel.openOrCloseShutter(body);
    ctx.response.ok(
      response,
      body.isOpen ? "Shutter is Opened." : "Shutter is Closed."
    );
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};
exports.getShutterStatus = async ctx => {
  try {
    const storeId = ctx.params.storeId;
    isValid({ storeId });
    const response = await storeModel.getShutterStatus(storeId);
    ctx.response.ok(response, "Shutter response.");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};
exports.assignProductToStore = async ctx => {
  try {
    const body = ctx.request.body;
    const storeId = ctx.params.id;
    let response;
    await body.productId.map(async productId => {
      response = await storeModel.assignProductToStore({
        storeId,
        productId: productId
      });
    });
    ctx.response.ok(response, "Ok.");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};
exports.list = async ctx => {
  try {
    const storeResponse = await storeModel.getList();
    ctx.response.ok(storeResponse, "ok");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};
exports.storeDetailsById = async ctx => {
  try {
    const storeResponse = await storeModel.getStoreDetailsByid(ctx.params.id);
    ctx.response.ok(storeResponse, "ok");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};
exports.updateStoreById = async ctx => {
  try {
    const storeId = ctx.params.id;
    const body = ctx.request.body;
    isValid({ storeId: storeId });
    const storeResponse = await storeModel.updateStoreByid(ctx.params.id, body);
    ctx.response.ok(storeResponse, "ok");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};
exports.pendingProgressOrders = async ctx => {
  try {
    isValid({ storeId: ctx.params.id });
    const storeResponse = await orderModel.pendingProgressOrdersByStoreId(
      ctx.params.id
    );
    ctx.response.ok(storeResponse, "ok");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};
exports.productListByStore = async ctx => {
  try {
    const productResponse = await storeModel.getProductListByStore(
      ctx.params.storeId
    );
    ctx.response.ok(productResponse, "ok");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};
exports.orders = async ctx => {
  try {
    const list = await orderModel.orders(ctx.query);
    ctx.response.ok(list, "ok");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};
exports.availableCash = async ctx => {
  try {
    let response;
    const request = ctx.request.body;
    const storeId = ctx.params.id;
    request.totalAmount = 0;
    request.cashNotes.map(note => {
      request.totalAmount += Number(note.name) * Number(note.quantity);
    });
    response = await storeModel.availableCash(storeId, request);
    ctx.response.ok(response, "Ok.");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};
exports.records = async ctx => {
  try {
    const id = ctx.params.id;
    const response = await storeModel.fetchRecords(id, ctx.query);
    ctx.response.ok(response, "Successfully fetched");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};

exports.summary = async ctx => {
  try {
    const data = await storeModel.getStoreInfo(ctx.params.id);
    const summary = storeModel.prepareSummary(data);
    ctx.response.ok(summary);
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};
