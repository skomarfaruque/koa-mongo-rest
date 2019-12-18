"use strict";
const order = require("../Schema/order");
const product = require("../Schema/product");
const store = require("../Schema/store");
const customer = require("../Schema/customer");
const orderHistory = require("../Schema/orderprocesshistory");
const originalOrderQueue = require("../Helpers/orderQueue");
const mongoose = require("mongoose");
const fetch = require("isomorphic-fetch");
const variables = require("../variables");
const crypto = require("crypto");
const productModel = require("../models/productModel");
const logger = require("../logger");
exports.create = async request => {
  let items = Object.assign({}, request.items);
  request.itemsFingerPrint = await crypto
    .createHash("md5")
    .update(JSON.stringify(items))
    .digest("hex");
  const response = await order.create(request);
  return response;
};
exports.orderHistoryByCustomerId = async customerId => {
  const rawResponse = await order.aggregate([
    {
      $match: { customerId: mongoose.Types.ObjectId(customerId) }
    },
    { $sort: { orderDate: -1 } },
    {
      $lookup: {
        from: "stores",
        localField: "storeId",
        foreignField: "_id",
        as: "storeInfo"
      }
    },
    {
      $unwind: "$storeInfo"
    },
    {
      $project: {
        updatedAt: 0,
        __v: 0,
        "items._id": 0,
        "items.configurations._id": 0,
        "items.configurations.configItems._id": 0,
        "storeInfo.__v": 0,
        "storeInfo.createdAt": 0,
        "storeInfo.updatedAt": 0
      }
    }
  ]);
  let response = JSON.parse(JSON.stringify(rawResponse));
  await Promise.all(
    response.map(async rawData => {
      await Promise.all(
        await rawData.items.map(async itemData => {
          if (itemData.addons.length) {
            let addonArray = [];
            await Promise.all(
              itemData.addons.map(async addonVal => {
                let addonData = await product
                  .findOne({ _id: mongoose.Types.ObjectId(addonVal.id) })
                  .select({ name: 1, price: 1 });
                let newAddonData = JSON.parse(JSON.stringify(addonData));
                if (newAddonData) {
                  newAddonData.id = newAddonData._id;
                  delete newAddonData._id;
                  addonArray.push(newAddonData);
                }
              })
            );
            itemData.addons = addonArray;
          }
        })
      );
    })
  );

  return response;
};
exports.mostRecentByCustomerId = async customerId => {
  const response = await order.aggregate([
    {
      $match: { customerId: mongoose.Types.ObjectId(customerId) }
    },
    { $sort: { orderDate: -1 } },
    { $limit: Number(variables.mostRecentLimit) },
    {
      $lookup: {
        from: "stores",
        localField: "storeId",
        foreignField: "_id",
        as: "storeInfo"
      }
    },
    {
      $unwind: "$storeInfo"
    },
    {
      $project: {
        updatedAt: 0,
        __v: 0,
        "items._id": 0,
        "items.configurations._id": 0,
        "items.configurations.configItems._id": 0,
        "storeInfo.__v": 0,
        "storeInfo.createdAt": 0,
        "storeInfo.updatedAt": 0
      }
    }
  ]);
  return response;
};
exports.mostFrequentByCustomerId = async customerId => {
  let response = [];
  const responseData = await order.aggregate([
    {
      $match: { customerId: mongoose.Types.ObjectId(customerId) }
    },
    {
      $group: {
        _id: "$itemsFingerPrint",
        orderData: { $first: "$$CURRENT" },
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ]);
  if (responseData) {
    await responseData.map(rsData => {
      response.push(rsData.orderData);
    });
  }
  return response;
};
exports.getOrderDetailsByid = async id => {
  const rawResponse = await order.findById(id).select({ updatedAt: 0, __v: 0 });
  let response = JSON.parse(JSON.stringify(rawResponse));
  await Promise.all(
    response.items.map(async itemData => {
      let productInitialVal = await product.findOne({
        _id: mongoose.Types.ObjectId(itemData.itemId)
      });
      itemData.productInitial = productInitialVal.productInitial;
      if (itemData.addons.length) {
        let addonArray = [];
        await Promise.all(
          itemData.addons.map(async addonVal => {
            let addonData = await product
              .findOne({ _id: mongoose.Types.ObjectId(addonVal.id) })
              .select({ name: 1, price: 1 });
            let newAddonData = JSON.parse(JSON.stringify(addonData));
            newAddonData.id = newAddonData._id;
            delete newAddonData._id;
            addonArray.push(newAddonData);
          })
        );
        itemData.addons = addonArray;
      }
    })
  );
  return response;
};
exports.pendingProgressOrdersByStoreId = async storeId => {
  const rawResponse = await order.aggregate([
    {
      $match: {
        $and: [
          { storeId: mongoose.Types.ObjectId(storeId) },
          { $or: [{ orderStatus: 1 }, { orderStatus: 2 }, { orderStatus: 3 }] }
        ]
      }
    },
    { $sort: { orderDate: 1 } },
    {
      $lookup: {
        from: "stores",
        localField: "storeId",
        foreignField: "_id",
        as: "storeInfo"
      }
    },
    {
      $lookup: {
        from: "customers",
        localField: "customerId",
        foreignField: "_id",
        as: "customerInfo"
      }
    },
    {
      $unwind: "$storeInfo"
    },
    {
      $unwind: "$customerInfo"
    },
    {
      $project: {
        updatedAt: 0,
        __v: 0,
        "items._id": 0,
        "items.configurations._id": 0,
        "items.configurations.configItems._id": 0,
        "storeInfo.__v": 0,
        "storeInfo.createdAt": 0,
        "storeInfo.updatedAt": 0
      }
    }
  ]);
  let response = JSON.parse(JSON.stringify(rawResponse));
  await Promise.all(
    response.map(async rawData => {
      await Promise.all(
        await rawData.items.map(async itemData => {
          let productInitialVal = await product.findOne({
            _id: mongoose.Types.ObjectId(itemData.itemId)
          });
          itemData.productInitial = productInitialVal.productInitial;
          if (itemData.addons.length) {
            let addonArray = [];
            await Promise.all(
              itemData.addons.map(async addonVal => {
                if (addonVal.id) {
                  let addonData = await product
                    .findOne({ _id: mongoose.Types.ObjectId(addonVal.id) })
                    .select({ name: 1, price: 1 });
                  let newAddonData = JSON.parse(JSON.stringify(addonData));
                  newAddonData.id = newAddonData._id;
                  delete newAddonData._id;
                  addonArray.push(newAddonData);
                }
              })
            );
            itemData.addons = addonArray;
          }
        })
      );
    })
  );
  return response;
};
exports.updateOrderByOrderId = async req => {
  const orderId = req.orderId;
  delete req.orderId;
  delete req.processedBy;
  const response = await order.findOneAndUpdate({ _id: orderId }, req, {
    new: true
  });
  const storeInfo = await store.findOne({ _id: response.storeId });
  const customerToken = await customer.findOne({
    _id: mongoose.Types.ObjectId(response.customerId)
  });
  const orderInformation = await order.aggregate([
    {
      $match: { _id: mongoose.Types.ObjectId(response._id) }
    },
    { $sort: { orderDate: -1 } },
    {
      $lookup: {
        from: "stores",
        localField: "storeId",
        foreignField: "_id",
        as: "storeInfo"
      }
    },
    {
      $unwind: "$storeInfo"
    },
    {
      $project: {
        updatedAt: 0,
        __v: 0,
        "items._id": 0,
        "items.configurations._id": 0,
        "items.configurations.configItems._id": 0,
        "storeInfo.__v": 0,
        "storeInfo.createdAt": 0,
        "storeInfo.updatedAt": 0
      }
    }
  ]);
  if (req.orderStatus === 3) {
    // const fireRes = await fetch('https://fcm.googleapis.com/fcm/send', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': `key=${variables.firebaseAuthKeyMobile}`
    //     },
    //     body: JSON.stringify({
    //         to:customerToken.deviceToken,
    //         channelId: "demo",
    //         data: {
    //             custom_notification: JSON.stringify(orderInformation[0]),
    //             notificationType: 'orderIsReady',
    //             clickAction: 'addLatestOrderInStore'
    //         },
    //         notification: {
    //             "title": "Tong",
    //             "body" : `Your order #${response.orderQueue} is ready to pickup from ${storeInfo.name}, ${storeInfo.address}.`,
    //             "text": "Text",
    //             icon: "ic_launcher",
    //             "sound": "default",
    //             "channelId": "demo",
    //             "show_in_foreground": true
    //         }
    //     })
    // });
    // const jResponse = await fireRes.json()
    // if (jResponse.success === 0) {

    // }
    let enablePointsPrice = 0;
    let enableSms = false;
    let cashback = 0;
    await Promise.all(
      await orderInformation[0].items.map(async itemData => {
        let allConfigPrice = itemData.price;
        await itemData.addons.map(async addonData => {
          let addonProductDetails = await productModel.getProductDetailsByid(
            addonData.id
          );
          if (addonProductDetails.enablePoints === false) {
            allConfigPrice -= addonProductDetails.price;
          }
        });
        let productDetails = await productModel.getProductDetailsByid(
          itemData.itemId
        );
        if (productDetails.enablePoints) {
          enableSms = true;
          enablePointsPrice += allConfigPrice * itemData.quantity;
          if (productDetails.cashback) {
            cashback +=
              Number(productDetails.cashback) *
              Number(itemData.quantity) *
              allConfigPrice /
              100;
          }
        }
      })
    );
    cashback.toFixed(2);
    let body = `Your order %23${response.orderQueue} is ready for pickup from ${
      storeInfo.name
    }. You've earned ${cashback} points on this order. Total points ${customerToken.balance.toFixed(
      2
    )}.`;
    if (response.homeDelivery) {
      body = `Your order %23${
        response.orderQueue
      } is on the way to your address from ${
        storeInfo.name
      }. You've earned ${cashback} points on this order. Total points ${customerToken.balance.toFixed(
        2
      )}.`;
    }
    const url = `${variables.smsGatewayURL}send?userid=${
      variables.smsGatewayUser
    }&password=${variables.smsGatewayPassword}&recipient=${
      customerToken.mobile
    }&sender=TONG&body=${body}`;
    if (enableSms) {
      await fetch(url, { method: "GET" });
    }
  }

  return response;
};
exports.addOrderProcessHistory = async req => {
  const response = await orderHistory.create(req);
  return response;
};
exports.getOrderQueue = async storeId => {
  let mainOrderQueue = await originalOrderQueue();
  const response = await order
    .find({
      $or: [{ orderStatus: 1 }, { orderStatus: 2 }],
      $and: [{ storeId: mongoose.Types.ObjectId(storeId) }]
    })
    .select("orderQueue");
  if (response.length) {
    let bookedQueue = [];
    await response.map(data => {
      bookedQueue.push(data.orderQueue);
    });
    mainOrderQueue = mainOrderQueue.filter(function(n) {
      return bookedQueue.indexOf(n) > -1 ? false : n;
    });
  }
  return mainOrderQueue;
};
exports.updateById = async (req, orderId) => {
  const response = await order.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(orderId) },
    req,
    { new: true }
  );
  return response;
};
exports.orders = async filter => {
  var match = {};
  if (filter.start) {
    const startDate = new Date(filter.start);
    const endDate = new Date(filter.end);
    endDate.setDate(endDate.getDate() + 1);
    match.orderDate = { $gte: startDate, $lte: endDate };
  }
  if (filter.storeId) {
    match.storeId = mongoose.Types.ObjectId(filter.storeId);
  }
  if (filter.orderStatus) {
    match.orderStatus = Number(filter.orderStatus);
  }
  if (filter.paymentMethod) {
    match.paymentMethod = Number(filter.paymentMethod);
  }
  const rawResponse = await order.aggregate([
    {
      $match: match
    },
    { $sort: { orderDate: 1 } },
    {
      $lookup: {
        from: "stores",
        localField: "storeId",
        foreignField: "_id",
        as: "storeInfo"
      }
    },
    {
      $lookup: {
        from: "customers",
        localField: "customerId",
        foreignField: "_id",
        as: "customerId"
      }
    },
    {
      $unwind: "$storeInfo"
    },
    {
      $unwind: "$customerId"
    },
    {
      $project: {
        updatedAt: 0,
        __v: 0,
        "items._id": 0,
        "items.configurations._id": 0,
        "items.configurations.configItems._id": 0,
        "storeInfo.__v": 0,
        "storeInfo.createdAt": 0,
        "storeInfo.updatedAt": 0
      }
    }
  ]);
  let response = JSON.parse(JSON.stringify(rawResponse));
  let orderList = [];
  response.map(order => {
    orderList.push({ orderId: order, date: order.orderDate });
  });
  return orderList;
};
