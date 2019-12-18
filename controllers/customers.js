"use strict";
const customerModel = require("../models/customerModel");
const productModel = require("../models/productModel");
const orderModel = require("../models/orderModel");
const deliveryModel = require("../models/deliveryModel");
const notificationModel = require("../models/notificationModel");
const validator = require("validatorjs");
const variables = require("../variables");
const errorResponseHandler = require("../middlewares/errorResponseHandler");
const stringifySafe = require("../Helpers/stringifySafe");
const mobileNumberFormat = require("../Helpers/mobileNumberFormat");
const offerModel = require("../models/offerModel");
const getCustomerInfoByAuthToken = async cusToken => {
  const customerInfo = await customerModel.getUserByAuthToken(cusToken);
  if (!customerInfo) {
    throw { status: 404, message: "Customer not found." };
  }
  return customerInfo;
};
const getCustomerInfoByMobile = async mobile => {
  const customerInfo = await customerModel.getCustomerInfoByMobile({ mobile });
  if (!customerInfo) {
    throw { status: 404, message: "Customer not found." };
  }
  return customerInfo;
};
const rules = () => ({
  mobile: [
    "required",
    "regex:/(^(\\+8801|8801|01|1|008801))[1|5-9]{1}(\\d){8}$/"
  ],
  customerId: ["required", "regex:/^[a-f\\d]{24}$"],
  password: ["required", `min:${variables.passwordLength}`],
  authToken: ["required"]
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
exports.registration = async ctx => {
  try {
    const body = ctx.request.body;
    isValid(body);
    body.mobile = await mobileNumberFormat(body.mobile);
    const userExist = await customerModel.userExists(body);
    if (userExist.length) {
      const token = userExist[0].tokenValues[0].token;
      if (userExist[0].mobileVerified) {
        throw { status: 406, message: "You are a verifed user.Please Login." };
      }
      if (userExist[0].source === 2) {
        const updates = {
          password: body.password,
          name: body.name,
          deviceToken: body.deviceToken
        };
        if (body.socialInfo) {
          if (body.socialInfo.source === "facebook") {
            updates.fbId = body.socialInfo.id;
          }
          if (body.socialInfo.source === "google") {
            updates.googleId = body.socialInfo.id;
          }
          if (body.socialInfo.photo) {
            updates.photo = body.socialInfo.photo;
          }
          if (body.socialInfo.email) {
            updates.email = body.socialInfo.email;
          }
        }
        await customerModel.updateCustomerById(updates, userExist[0]._id);
      }
      ctx.response.ok(
        {
          id: userExist[0]._id,
          token,
          mobileVerified: userExist[0].mobileVerified
        },
        "verified false."
      );
    } else {
      if (body.socialInfo) {
        if (body.socialInfo.source === "facebook") {
          body.fbId = body.socialInfo.id;
        }
        if (body.socialInfo.source === "google") {
          body.googleId = body.socialInfo.id;
        }
        if (body.socialInfo.photo) {
          body.photo = body.socialInfo.photo;
        }
        if (body.socialInfo.email) {
          body.email = body.socialInfo.email;
        }
        if (body.socialInfo.name) {
          body.name = body.socialInfo.name;
        }
      }
      const customerReponse = await customerModel.create(body);
      const data = {
        id: customerReponse._id,
        token: customerReponse.customerToken.token
      };
      ctx.response.ok(data, "Registration success.");
    }
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};
exports.annonemousUserAdd = async ctx => {
  try {
    const body = ctx.request.body;
    const customerReponse = await customerModel.annonymousUserAddOrUpdate(body);
    const data = {
      id: customerReponse._id,
      token: customerReponse.customerToken.token
    };
    ctx.response.ok(data, "Registration success.");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};
exports.generateCustomerToken = async ctx => {
  try {
    let body = ctx.request.body;
    const validation = isValid(body);
    body.mobile = await mobileNumberFormat(body.mobile);
    const mobile = body.mobile;
    const customerInfo = await customerModel.getCustomerInfoByMobile({
      mobile
    });
    body.customerId = customerInfo._id;
    const customerToken = await customerModel.getCustomerAuthTokenById(body);
    if (customerToken) {
      const token = customerToken.token;
      return ctx.response.ok({ token }, "ok");
    }
    const customerAuthTokenReponse = await customerModel.createNewAuthToken(
      body
    );
    const data = {
      token: customerAuthTokenReponse.token
    };
    ctx.response.ok(data, "ok");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};
exports.isExists = async ctx => {
  try {
    let body = ctx.request.body;
    isValid({ mobile: body.mobile });
    body.mobile = await mobileNumberFormat(body.mobile);
    const customerInfo = await getCustomerInfoByMobile(body.mobile);
    body._id = customerInfo._id;
    if (body.name) {
      await customerModel.updateCustomerById({ name: body.name }, body._id);
    }
    const token = await customerModel.updateOrCreateAuthToken(body);
    ctx.response.ok(
      {
        id: customerInfo._id,
        age: customerInfo.age,
        gender: customerInfo.gender,
        name: customerInfo.name,
        balance: customerInfo.balance,
        address: customerInfo.address,
        token,
        segments: await offerModel.getCustomerSegments(customerInfo._id)
      },
      "ok."
    );
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};
exports.customersWalletBalance = async ctx => {
  try {
    const cusToken = ctx.request.header.custoken;
    const customerId = ctx.params.id;
    const customerInfo = await getCustomerInfoByAuthToken(cusToken);
    if (customerInfo.customerId._id != customerId) {
      throw { status: 400, message: "Authentication failed." };
    }
    return ctx.response.ok(
      { balance: customerInfo.customerId.balance },
      "Customer found."
    );
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};
exports.setPassword = async ctx => {
  try {
    const body = ctx.request.body;
    const customerId = ctx.params.id;
    isValid(body);
    await customerModel.changePassword(body.password, customerId);
    ctx.response.ok(null, "Password changed successfully.");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};
exports.mobileVerification = async ctx => {
  try {
    const cusToken = ctx.request.header.custoken;
    const customerId = ctx.params.id;
    isValid({ customerId });
    const customerInfo = await getCustomerInfoByAuthToken(cusToken);
    const makeUserVerified = await customerModel.makeUserVerifiedByUserId(
      customerInfo.customerId._id
    );
    const responseData = {
      token: customerInfo.token,
      name: customerInfo.customerId.name,
      balance: customerInfo.customerId.balance,
      walletNumber: customerInfo.customerId.walletNumber,
      mobileVerified: makeUserVerified.mobileVerified
    };
    ctx.response.ok(responseData, "Verification success.");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};
exports.login = async ctx => {
  var getUserInfo = {};
  try {
    const body = ctx.request.body;
    if (body.id) {
      getUserInfo = await customerModel.socialLogin(body);
      if (!getUserInfo) {
        throw { status: 400, message: "Login Failed." };
      }
    } else {
      isValid(body);
      body.mobile = await mobileNumberFormat(body.mobile);
      getUserInfo = await customerModel.login(body);
      if (!getUserInfo) {
        throw { status: 400, message: "Login Failed." };
      }
    }
    body._id = getUserInfo._id;
    const token = await customerModel.updateOrCreateAuthToken(body);
    await customerModel.updateDevicetoken({
      deviceToken: body.deviceToken,
      id: getUserInfo._id
    });
    let responseData = {
      id: getUserInfo._id,
      token,
      mobileVerified: getUserInfo.mobileVerified,
      mobile: getUserInfo.mobile,
      address: getUserInfo.address
    };
    if (getUserInfo.mobileVerified) {
      (responseData.name = getUserInfo.name),
        (responseData.walletNumber = getUserInfo.walletNumber);
    }
    responseData.segments = await offerModel.getCustomerSegments(getUserInfo._id);

    ctx.response.ok(responseData, "Login success.");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};
exports.placeOrder = async ctx => {
  try {
    const cusToken = ctx.request.header.custoken;
    const customerId = ctx.params.id;
    isValid({ customerId });
    const body = ctx.request.body;
    const customerInfo = await getCustomerInfoByAuthToken(cusToken);
    if (customerInfo.customerId._id != customerId) {
      throw { status: 400, message: "Authentication failed." };
    }
    body.customerId = customerId;
    if (body.paymentMethod === 3) {
      // wallet pay need to check if the user has availabe wallet balance to pay via it.
      if (body.price > customerInfo.customerId.balance) {
        throw { status: 400, message: "You do not have enough balance." };
      }
    }
    const orderQueue = await orderModel.getOrderQueue(body.storeId);
    body.orderQueue = orderQueue[Math.floor(Math.random() * orderQueue.length)];
    const orderResponse = await orderModel.create(body);
    if (body.homeDelivery) {
      if (!customerInfo.customerId.address) {
        customerInfo.address = [];
      } else {
        customerInfo.address = customerInfo.customerId.address;
      }
      var addrMatched = false;
      customerInfo.address.map(async addr => {
        if (addr.details === body.address.details) {
          addrMatched = true;
        }
      })
      if (!addrMatched) {
        customerInfo.address.push(body.address);
        await customerModel.update(customerId, { address: customerInfo.address })
      }
    }
    await notificationModel.sendPushToCook(orderResponse);
    let balance = 0;
    let cashback = 0;
    await Promise.all(
      await body.items.map(async itemData => {
        let itemTotal = itemData.price;
        await itemData.addons.map(async addonData => {
          let addonProductDetails = await productModel.getProductDetailsByid(
            addonData.id
          );
          if (addonProductDetails.enablePoints === true) {
            if (addonProductDetails.cashback) {
              cashback += (Number(addonProductDetails.cashback) * Number(addonProductDetails.price)) / 100;
            }
          }
          itemTotal -= addonProductDetails.price;
        });
        let productDetails = await productModel.getProductDetailsByid(
          itemData.itemId
        );
        if (productDetails.enablePoints) {
          if (productDetails.cashback) {
            cashback += (Number(productDetails.cashback) * Number(itemData.quantity) * itemTotal) / 100;
          }
        }
      })
    );
    if (body.paymentMethod === 3) {
      // check is the payment method. 3 means wallet so wallet balance must be adjusted
      balance =
        customerInfo.customerId.balance -
        body.price
    } else {
      balance = Number(customerInfo.customerId.balance) + Number(cashback);
    }
    const customersBalance = await customerModel.updateCustomerBalance(
      balance,
      customerInfo.customerId._id
    );

    ctx.response.ok(
      {
        orderNumber: body.orderQueue,
        orderId: orderResponse._id,
        orderDate: orderResponse.orderDate,
        balance: customersBalance.balance.toFixed(2)
      },
      "Order has been placed successfully."
    );
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};
exports.customersOrderHistory = async ctx => {
  try {
    const cusToken = ctx.request.header.custoken;
    const customerId = ctx.params.id;
    isValid({ customerId });
    const customerInfo = await getCustomerInfoByAuthToken(cusToken);
    if (customerInfo.customerId._id != customerId) {
      throw { status: 400, message: "Authentication failed." };
    }
    const orderHistory = await orderModel.orderHistoryByCustomerId(
      customerInfo.customerId._id
    );
    ctx.response.ok(orderHistory, "Order history found.");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};
exports.mostRecentFrequentOrders = async ctx => {
  try {
    const cusToken = ctx.request.header.custoken;
    const customerId = ctx.params.id;
    isValid({ customerId });
    const customerInfo = await getCustomerInfoByAuthToken(cusToken);
    if (customerInfo.customerId._id != customerId) {
      throw { status: 400, message: "Authentication failed." };
    }
    const mostRecent = await orderModel.mostRecentByCustomerId(
      customerInfo.customerId._id
    );
    const mostFrequent = await orderModel.mostFrequentByCustomerId(
      customerInfo.customerId._id
    );
    ctx.response.ok({ mostRecent, mostFrequent }, "Order history found.");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};
exports.customerDetails = async ctx => {
  try {
    const customerId = ctx.params.id;
    isValid({ customerId });
    const customerDetails = await customerModel.getCustomerInfoById(customerId);
    if (customerDetails) {
      ctx.response.ok(customerDetails, "Customer found.");
    } else {
      throw { status: 404, message: "Cusomter not Found." };
    }
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};
exports.updateCustomer = async ctx => {
  try {
    const customerId = ctx.params.id;
    isValid({ customerId });
    const customerDetails = await customerModel.updateCustomerById(
      ctx.request.body,
      customerId
    );
    ctx.response.ok(customerDetails, "Customer updated.");
  } catch (err) {
    ctx.log.error(stringifySafe(err, null, 2));
    errorResponseHandler(ctx, err);
  }
};
