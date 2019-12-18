"use strict";
const Segments = require("../Schema/segments");
const Offers = require("../Schema/offers");
const Coupons = require("../Schema/coupons");
const Campaigns = require("../Schema/campaigns");
const products = require("../Schema/product");
const categories = require("../Schema/category");
const stores = require("../Schema/store");
const customers = require("../Schema/customer");
const Claims = require("../Schema/offerClaimed");
const orders = require("../Schema/order");
const mongoose = require("mongoose");
exports.createSegment = async request => {
  if (request.type === "STORES" || request.type === "PRODUCTS" || request.type === "CATEGORIES") {
    request.externalModelType = request.type.toLowerCase()
  }
  const response = await Segments.create(request);
  return response;
};

exports.listSegment = async request => {
  const response = await Segments.find().populate({ path: "referance" })
  return response;
};

exports.updateSegment = async (id, request) => {
  if (request.type === "STORES" || request.type === "PRODUCTS" || request.type === "CATEGORIES") {
    request.externalModelType = request.type.toLowerCase()
  }
  const response = await Segments.findOneAndUpdate({ "_id": mongoose.Types.ObjectId(id) }, { $set: request }, { new: true });
  return response;
};

exports.createOffer = async request => {
  const response = await Offers.create(request);
  return response;
};

exports.listOffer = async request => {
  const response = await Offers.find().populate({ path: "product" });
  return response;
};

exports.updateOffer = async (id, request) => {
  const response = await Offers.findOneAndUpdate({ "_id": mongoose.Types.ObjectId(id) }, { $set: request }, { new: true });
  return response;
};

exports.createCoupon = async request => {
  const response = await Coupons.create(request);
  return response;
};

exports.listCoupon = async request => {
  if (!request) {
    return await Coupons.find({ expired: false });
  } else {
    return await Coupons.find();
  }
};

exports.updateCoupon = async (id, request) => {
  const response = await Coupons.findOneAndUpdate({ "_id": mongoose.Types.ObjectId(id) }, { $set: request }, { new: true });
  return response;
};

exports.createCampaign = async request => {
  const response = await Campaigns.create(request);
  return response;
};

exports.listCampaign = async request => {
  const response = await Campaigns.find().populate({ path: "segment" }).populate({ path: "offer" }).populate({ path: "coupon" });
  return response;
};

exports.updateCampaign = async (id, request) => {
  const response = await Campaigns.findOneAndUpdate({ "_id": mongoose.Types.ObjectId(id) }, { $set: request }, { new: true });
  return response;
};

exports.fetchFactors = async (request) => {
  var now = new Date();
  const customer = await getCustomerInfo(request.customerId);
  var days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  const factors = {
    customerId: request.customerId,
    orderDate: new Date(),
    orderTime: now.getHours(),
    orderDay: days[now.getDay()],
    orderSource: GetChannelName(request.orderSource),
    storeId: request.storeId,
    categories: [],
    products: [],
    productOption: [],
    customerAge: customer.age,
    totalOrders: customer.totalOrders,
    totalSpending: customer.totalSpending,
    orderTotal: request.price || 0
  }
  if (request.items) {
    request.items.map(async item => {
      var categoryId = await getCategoryID(item.itemId);
      if (factors.categories.indexOf(categoryId) === -1) {
        factors.categories.push(categoryId)
      }
      factors.products.push(item.itemId);
      if (item.attributes) {
        item.attributes.map(attr => {
          var productOption = item.itemId + "-" + attr.name + "-" + attr.option.name;
          var option = productOption.toUpperCase();
          factors.productOption.push(option);
        })
      }
    })
  }
  return factors;
}

const GetChannelName = (source) => {
  if (source === 2) {
    return "POS";
  } else if (source === 1) {
    return "MCOMMERCE";
  } else {
    return "INVALID SOURCE";
  }
}

const getCustomerInfo = async (customerId = "") => {
  const customerInfo = {
    age: 0,
    totalOrders: 0,
    totalSpending: 0
  }
  if (customerId !== "") {
    const orderList = await orders.find({ 'customerId': customerId }).populate({ path: "customerId", select: "age" }).select('price');
    if (orderList.length) {
      if (orderList[0].customerId.age) {
        var age = orderList[0].customerId.age.split("-");
        customerInfo.age = age[0];
      }
      customerInfo.totalOrders = orderList.length;
      orderList.map(order => {
        customerInfo.totalSpending += order.price;
      })
    }
  }
  return customerInfo;
}

const getCategoryID = async (productId) => {
  const productInfo = await products.findById(productId).select('categoryId');
  return productInfo.categoryId;
}

exports.getCategoryName = async (categoryId) => {
  const category = await categories.findById(categoryId).select('name');
  return category.name;
}

exports.couponUsed = async (campaign, customerId = "") => {
  if (campaign.maxRedeemPerUser === 0) {
    return false
  }
  if (customerId !== "") {
    const claimed = await Claims
      .count({ 'customer': mongoose.Types.ObjectId(customerId), 'campaign': mongoose.Types.ObjectId(campaign._id) });
    if (campaign.maxRedeemPerUser > claimed) {
      return false
    }
  } else {
    return false
  }

  return true;
};

exports.getCustomerSegments = async (customerId) => {
  var customerInfo = await getCustomerInfo(customerId);
  var segments = await Segments.find().where('type').in(["MASS", "AGE-RANGE", "NUMBER-OF-ORDERS", "TOTAL-SPENDING"]);
  var segmentList = [];
  segments.map(segment => {
    switch (segment.type) {
      case "MASS":
        segmentList.push({ id: segment._id, name: segment.name }); break;
      case "AGE-RANGE":
        if (segment.startRange <= customerInfo.age && segment.endRange >= customerInfo.age) {
          segmentList.push({ id: segment._id, name: segment.name });
        } break;
      case "NUMBER-OF-ORDERS":
        if (segment.startRange <= customerInfo.totalOrders && segment.endRange >= customerInfo.totalOrders) {
          segmentList.push({ id: segment._id, name: segment.name });
        } break;
      case "TOTAL-SPENDING":
        if (segment.startRange <= customerInfo.totalSpending && segment.endRange >= customerInfo.totalSpending) {
          segmentList.push({ id: segment._id, name: segment.name });
        } break;
    }
  })
  return segmentList;
}

exports.checkAvailablity = async (campaign, request) => {
  if (
    campaign.segment &&
    campaign.startDate <= request.orderDate &&
    campaign.endDate >= request.orderDate &&
    campaign.channel === request.orderSource &&
    (campaign.maxRedeem === 0 || campaign.maxRedeem > campaign.totalUsed)

  ) {
    return true;
  }
  return false;
}

exports.checkEligibility = async (campaign, request) => {
  var couponUsed = await this.couponUsed(campaign, request.customerId);
  if (!couponUsed) {
    switch (campaign.segment.type) {
      case "STORE":
        if (campaign.segment.referance == request.storeId) {
          return true;
        }
        break;
      case "MASS":
        return true;
      case "CATEGORY":
        if (request.categories.indexOf(campaign.segment.referance) > -1) {
          return true;
        } else {
          var categoryName = await this.getCategoryName(campaign.segment.referance);
          return { message: 'Get Any item from ' + categoryName + ' category to avail ' + campaign.offer.name + ' offer' }
        }
        break;
      case "PRODUCT":
        if (request.products.indexOf(String(campaign.segment.referance)) > -1) {
          if (campaign.segment.specific) {

            var productOption = campaign.segment.referance + "-" + campaign.segment.specific.attribute + "-" + campaign.segment.specific.option;
            var option = productOption.toUpperCase();
            if (request.productOption.indexOf(option) > -1) {
              return true;
            } else {
              return { message: 'Order ' + campaign.segment.name + ' to avail ' + campaign.offer.name }
            }
          } else {
            return true;
          }
        } else {
          return { message: 'order ' + campaign.segment.name + ' to get ' + campaign.offer.name }
        }
        break;
      case "AGE-RANGE":
        if (campaign.segment.startRange <= request.customerAge) {
          if (campaign.segment.endRange > 0) {
            if (campaign.segment.endRange >= request.customerAge) {
              return true;
            }
          } else {
            return true;
          }
        }
        break;
      case "NUMBER-OF-ORDERS":
        if (campaign.segment.startRange <= request.totalOrders) {
          if (campaign.segment.endRange > 0) {
            if (campaign.segment.endRange >= request.totalOrders) {
              return true;
            }
          } else {
            return true;
          }
        }
        break;
      case "TOTAL-SPENDING":
        if (campaign.segment.startRange <= request.totalSpending) {
          if (campaign.segment.endRange > 0) {
            if (campaign.segment.endRange >= request.totalSpending) {
              return true;
            }
          } else {
            return true;
          }
        }
        break;
      case "HAPPY-HOUR":
        if (campaign.segment.startRange <= request.orderTime) {
          if (campaign.segment.endRange > 0) {
            if (campaign.segment.endRange >= request.orderTime) {
              return true;
            }
          } else {
            return true;
          }
        }
        break;
      case "SPECIFIC-DAY":
        if (campaign.segment.specific.day === request.orderDay) {
          return true;
        }
        break;
      case "ORDER-TOTAL":
        if (campaign.segment.startRange <= request.orderTotal) {
          if (campaign.segment.endRange > 0) {
            if (campaign.segment.endRange >= request.orderTotal) {
              return true;
            }
          } else {
            return true;
          }
        } else {
          var requireMore = Number(campaign.segment.startRange) - Number(request.orderTotal);
          if (requireMore <= 100) {
            return { message: 'Order ' + requireMore + ' TAKA more to get ' + campaign.offer.name }
          }
        }
        break;
      default:
        return false;
    }
  } else {
    return false;
  }
}

exports.fetchOffers = async orderDetails => {
  const campaignList = [];
  const suggestion = [];
  const availableCampaigns = [];
  const request = await this.fetchFactors(orderDetails);
  const campaigns = await this.listCampaign();
  await Promise.all(
    campaigns.map(async campaign => {
      const available = await this.checkAvailablity(campaign, request);
      if (available) {
        var eligible = await this.checkEligibility(campaign, request);
        if (eligible === true) {
          availableCampaigns.push({ campaign: campaign.segment.name + " " + campaign.offer.name, discountAmount: campaign.offer.amount, discountType: campaign.offer.type })
          campaignList.push(campaign);
        } else if (typeof eligible === "object") {
          suggestion.push(eligible)
        }
      }
    })
  )
  return { availableCampaigns, campaignList, suggestion }
};

exports.fetchCategoryOffers = async (orderDetails, catList) => {
  const campaignList = [];
  const request = await this.fetchFactors(orderDetails);
  const campaigns = await this.listCampaign();
  const categories = [];
  const products = [];
  await Promise.all(
    campaigns.map(async campaign => {
      if (campaign.segment !== null && (campaign.segment.type === "CATEGORY" || campaign.segment.type === "PRODUCT")) {
        const available = await this.checkAvailablity(campaign, request);
        if (available) {
          if (campaign.segment.type === "CATEGORY") {
            catList.map((cat, key) => {
              if (cat._id === String(campaign.segment.referance)) {
                catList[key].offer = campaign.offer.name;
              }
            })
          } else {
            catList.map((cat, catId) => {
              cat.products.map((product, productId) => {
                if (product._id === String(campaign.segment.referance)) {
                  if (campaign.segment.specific.attribute) {
                    product.attributes.map((attr, attrId) => {
                      if (attr.name === campaign.segment.specific.attribute) {
                        attr.options.map((option, optionId) => {
                          if (option.name === campaign.segment.specific.option) {
                            catList[catId].products[productId].attributes[attrId].options[optionId].offer = campaign.offer.name;
                          }
                        })
                      }
                    })
                  } else {
                    catList[catId].products[productId].offer = campaign.offer.name;
                  }
                }
              })
            })
          }

          campaignList.push({
            type: campaign.segment.type,
            specific: campaign.segment.specific,
            referance: campaign.segment.referance,
            offer: campaign.offer.name
          });
        }
      }
    })
  )
  return catList
};