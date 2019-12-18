"use strict";
const offerModel = require("../models/offerModel");
const errorResponseHandler = require("../middlewares/errorResponseHandler");
const stringifySafe = require("../Helpers/stringifySafe");


exports.createSegment = async ctx => {
  try {
    const body = ctx.request.body;
    const response = await offerModel.createSegment(body);
    ctx.response.ok(response, "ok");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};
exports.listSegment = async ctx => {
  try {
    const response = await offerModel.listSegment();
    ctx.response.ok(response, "ok");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};

exports.updateSegment = async ctx => {
  try {
    const body = ctx.request.body;
    const response = await offerModel.updateSegment(ctx.query.id, body);
    ctx.response.ok(response, "ok");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};

exports.createOffer = async ctx => {
  try {
    const body = ctx.request.body;
    const response = await offerModel.createOffer(body);
    ctx.response.ok(response, "ok");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};
exports.listOffer = async ctx => {
  try {
    const response = await offerModel.listOffer();
    ctx.response.ok(response, "ok");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};

exports.updateOffer = async ctx => {
  try {
    const body = ctx.request.body;
    const response = await offerModel.updateOffer(ctx.query.id, body);
    ctx.response.ok(response, "ok");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};

exports.createCoupon = async ctx => {
  try {
    const body = ctx.request.body;
    const response = await offerModel.createCoupon(body);
    ctx.response.ok(response, "ok");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};
exports.listCoupon = async ctx => {
  try {
    var expired = false;
    if (ctx.query.all) {
      expired = true
    }
    const response = await offerModel.listCoupon(expired);
    ctx.response.ok(response, "ok");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};

exports.updateCoupon = async ctx => {
  try {
    const body = ctx.request.body;
    const response = await offerModel.updateCoupon(ctx.query.id, body);
    ctx.response.ok(response, "ok");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};


exports.createCampaign = async ctx => {
  try {
    const body = ctx.request.body;
    body.totalUsed = 0;
    const response = await offerModel.createCampaign(body);
    ctx.response.ok(response, "ok");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};
exports.listCampaign = async ctx => {
  try {
    const response = await offerModel.listCampaign();
    ctx.response.ok(response, "ok");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};

exports.updateCampaign = async ctx => {
  try {
    const body = ctx.request.body;
    const response = await offerModel.updateCampaign(ctx.query.id, body);
    ctx.response.ok(response, "ok");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};

exports.searchCampaign = async ctx => {
  try {
    const response = await offerModel.fetchOffers(ctx.request.body)
    ctx.response.ok(response, "ok");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};

