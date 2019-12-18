"use strict";

const Router = require("koa-router");
const customerController = require("./controllers/customers");
const storeController = require("./controllers/stores");
const categoryController = require("./controllers/categories");
const productController = require("./controllers/products");
const fakeData = require("./controllers/fakedata");
const orderController = require("./controllers/orders");
const userController = require("./controllers/users");
const inventoryController = require("./controllers/inventories");
const notificationController = require("./controllers/notifications");
const feedbackController = require("./controllers/feedbacks");
const vendorController = require("./controllers/vendors");
const reportController = require("./controllers/reports");
const charityController = require("./controllers/charities");
const payment = require("./controllers/payment");
const announcementController = require("./controllers/announcements");
const accountsController = require("./controllers/accounts");
const offerController = require("./controllers/offers");
const deliveryController = require("./controllers/delivery");
const auth = require("./middlewares/auth");
const multer = require("koa-multer");
const upload = multer({ storage: multer.memoryStorage() });
const router = new Router();
router.post("/customers", auth.isAuthorized, customerController.registration); // registration api
router.post(
  "/customers/anonymous",
  auth.isAuthorized,
  customerController.annonemousUserAdd
); // anonymous user add by POS
router.put(
  "/customers/verification/:id",
  auth.isAuthorized,
  customerController.mobileVerification
); // mobile verification
router.put(
  "/customers/password/:id",
  auth.isAuthorized,
  customerController.setPassword
); // change password by user id
router.post("/customers/login", auth.isAuthorized, customerController.login); // login api
router.put(
  "/customers/isExist",
  auth.isAuthorized,
  customerController.isExists
); // customer is exists
router.post(
  "/customers/token",
  auth.isAuthorized,
  customerController.generateCustomerToken
); // create new customer token
router.get(
  "/customers/balance/:id",
  auth.isAuthorized,
  customerController.customersWalletBalance
); // get wallet balance
router.get(
  "/customers/:id",
  auth.isAuthorized,
  customerController.customerDetails
); // get customer info by customer id
router.put(
  "/customers/updateinfo/:id",
  auth.isAuthorized,
  customerController.updateCustomer
); // get customer info by customer id
router.post(
  "/customers/orders/:id",
  auth.isAuthorized,
  customerController.placeOrder
); // place new order
router.get(
  "/customers/orders/:id",
  auth.isAuthorized,
  customerController.customersOrderHistory
); // customers order history
router.get(
  "/customers/recentfrequent/:id",
  auth.isAuthorized,
  customerController.mostRecentFrequentOrders
); // customers most recent and frequesnt history
router.post("/stores", auth.isAuthorized, storeController.create); // create new store
router.post(
  "/stores/shutter",
  auth.isAuthorized,
  storeController.openCloseShutter
); // Open or close shutters of a store
router.get(
  "/stores/shutter/:storeId",
  auth.isAuthorized,
  storeController.getShutterStatus
); // get a specific stores shutter status
router.get("/stores", auth.isAuthorized, storeController.list); // fetch store lists
router.get("/stores/:id", auth.isAuthorized, storeController.storeDetailsById); // specific store details
router.put("/stores/:id", auth.isAuthorized, storeController.updateStoreById); // update specific store by id
router.post(
  "/stores/assignproduct/:id",
  auth.isAuthorized,
  storeController.assignProductToStore
); // product and store map
router.get(
  "/stores/products/:storeId",
  auth.isAuthorized,
  storeController.productListByStore
); // specific store details
router.get(
  "/stores/pendingprogressorders/:id",
  auth.isAuthorized,
  storeController.pendingProgressOrders
); // specific store details
router.post("/categories", auth.isAuthorized, categoryController.create); // create new category
router.get("/categories", auth.isAuthorized, categoryController.categoryList); // category list
router.get(
  "/stores/categorywiseproducts/:id",
  auth.isAuthorized,
  categoryController.list
); // category list with products by store id
router.get(
  "/stores/categorywiseproductsmobile/:id",
  auth.isAuthorized,
  categoryController.listWithoutPos
); // category list with products by store id filtered by display availability
router.get(
  "/categories/products/:id",
  auth.isAuthorized,
  productController.productListByCategory
); // products by category id
router.post("/products", auth.isAuthorized, productController.create); // create new product
router.put("/products", auth.isAuthorized, productController.update); // update product
router.post(
  "/productoptions",
  auth.isAuthorized,
  productController.addOrUpdateProductOptions
); // add/update new product options
router.get(
  "/productoptions/:productId",
  auth.isAuthorized,
  productController.productOptionDetails
); // show the details of product options by product id
router.post(
  "/productitems/:productId",
  auth.isAuthorized,
  productController.addProductItems
); // map product and inventory item
router.get(
  "/productitems/:productId",
  auth.isAuthorized,
  productController.productItems
); // map product and inventory item
router.get("/products", auth.isAuthorized, productController.list); // product list
router.get("/orders", auth.isAuthorized, storeController.orders); // order list
router.get(
  "/products/:id",
  auth.isAuthorized,
  productController.productDetailsById
); // product details by id
router.get("/orders/:id", auth.isAuthorized, orderController.orderDetailsById); // order details by order id
router.put(
  "/orders/:id",
  auth.isAuthorized,
  orderController.processUpdateOrder
); // update and process the order
router.put("/users/login", auth.isAuthorized, userController.login); // user/admin login
router.put("/users/logout", auth.isAuthorized, userController.logOut); // users logout
router.post("/users", auth.isAuthorized, userController.create); // add new user
router.get("/users", auth.isAuthorized, userController.listUsers); // add new user
router.get(
  "/users/loginhistories",
  auth.isAuthorized,
  userController.loginHistory
); // users attendance/login history
router.post(
  "/notifications/sendCode",
  auth.isAuthorized,
  notificationController.sendVerificationCode
); // order details by order id
router.post(
  "/fakedata/addcategoryandproduct",
  auth.isAuthorized,
  fakeData.insertCatProduct
); // order details by order id
router.post(
  "/fakedata/customers/orders/:mobile",
  auth.isAuthorized,
  fakeData.createOrder
); // order details by order id
router.post(
  "/inventories/items",
  auth.isAuthorized,
  inventoryController.addItem
); // insert inventory items
router.patch(
  "/inventories/items/",
  auth.isAuthorized,
  inventoryController.updateItem
); // insert inventory items
router.get(
  "/inventories/items",
  auth.isAuthorized,
  inventoryController.itemList
); // get inventory items
router.post(
  "/inventories/purchaseorders",
  auth.isAuthorized,
  inventoryController.newPurchase
); // add purchase orders
router.patch(
  "/inventories/purchaseorders/:id",
  auth.isAuthorized,
  inventoryController.updatePurchase
); // add purchase orders
router.post(
  "/inventories/salesorders",
  auth.isAuthorized,
  inventoryController.newSalesOrder
); // add new sales orders
router.get(
  "/inventories/salesorders",
  auth.isAuthorized,
  inventoryController.getSalesOrderList
); // sales orders list
router.get(
  "/inventories/purchaseorders",
  auth.isAuthorized,
  inventoryController.purchaseOrdersList
); // add purchase orders
router.post(
  "/inventories/warehouses",
  auth.isAuthorized,
  inventoryController.addWareHouseStores
); // add new warehouse stores
router.get(
  "/inventories/warehouses",
  auth.isAuthorized,
  inventoryController.wareHouseStores
); // warehouse stores
router.post(
  "/inventories/transfers",
  auth.isAuthorized,
  inventoryController.transferItemToWareHouse
); // transfer item to warehouse
router.post(
  "/inventories/items/options",
  auth.isAuthorized,
  inventoryController.addItemsOptions
); // add options for the inventory items
router.get(
  "/inventories/items/options/:itemId",
  auth.isAuthorized,
  inventoryController.optionsByItem
); // add options for the inventory items
router.post(
  "/inventories/inventoryin",
  auth.isAuthorized,
  inventoryController.addInventoryStock
); // add inventory stock
// router.get("/inventories/stocks/:storeId/:itemId", auth.isAuthorized, inventoryController.stockDetailsByStoreAndItem); // get item stock for store
router.get(
  "/inventories/stocks/stores/:storeId",
  auth.isAuthorized,
  inventoryController.getItemStocksByStoreId
); // get all items stock by store id
router.get(
  "/inventories/orderitems/:orderId",
  auth.isAuthorized,
  inventoryController.getOrderItemsByOrderId
); // insert inventory items
router.post(
  "/inventories/mappings/:productId",
  auth.isAuthorized,
  inventoryController.addProductMapping
); // permutation mapping
router.get(
  "/inventories/mappings/:productId",
  auth.isAuthorized,
  inventoryController.productMappingList
); // permutation listing by product id
router.patch(
  "/inventories/stocks/stores/notificationquantity",
  auth.isAuthorized,
  inventoryController.updateNotificationQuantity
); // update notificatin quantity with add new item in stock
router.post(
  "/feedback/questions",
  auth.isAuthorized,
  feedbackController.addQuestions
); // add new feedback
router.get(
  "/feedback/questions",
  auth.isAuthorized,
  feedbackController.questionLists
); // question list for feedback
router.put(
  "/feedback/questions/:id",
  auth.isAuthorized,
  feedbackController.updateQuestion
); // update feedbackquestion by question id
router.delete(
  "/feedback/questions/:id",
  auth.isAuthorized,
  feedbackController.deletQuestion
); // delete feedbackquestion by question id
router.post(
  "/feedback/answers/:orderId",
  auth.isAuthorized,
  feedbackController.addFeedbackAnswers
); // add new feedback
router.post("/attributes", auth.isAuthorized, productController.addAttribute); // add new attribute
router.get("/attributes", auth.isAuthorized, productController.attributeList); // show to list of attributes
router.post("/vendors", auth.isAuthorized, vendorController.addVendor); // add new vendor
router.get("/vendors", auth.isAuthorized, vendorController.vendorList); // all vendor list
router.put("/vendors/:id", auth.isAuthorized, vendorController.updateVendor); // update vendor

router.post(
  "/dailystocksreport/:storeId",
  auth.isAuthorized,
  reportController.addDailyReport
); // add daily stock
router.get(
  "/dailystocksreport/:storeId",
  auth.isAuthorized,
  reportController.getDailyStockReport
); // get daily stock report
router.post(
  "/feedbacks/requests",
  auth.isAuthorized,
  feedbackController.sendFeedbackRequest
); // send customer feedback request
router.post(
  "/requisition",
  auth.isAuthorized,
  inventoryController.createRequisition
); // create requisition
router.get(
  "/requisition",
  auth.isAuthorized,
  inventoryController.requisitionList
); // create requisition
router.patch(
  "/requisition",
  auth.isAuthorized,
  inventoryController.requisitionUpdate
); // update requisition
router.post("/charities", auth.isAuthorized, charityController.add); // add new charity
router.delete("/charities/:id", auth.isAuthorized, charityController.delete); // delete specific charity
// Payment
router.post("/orders/payment", auth.isAuthorized, payment.initiate);
router.post("/orders/payment/notify", payment.callback);
router.get("/orders/payment/:id", auth.isAuthorized, payment.details);
router.post(
  "/stores/cash/:id",
  auth.isAuthorized,
  storeController.availableCash
); // submit available cash
router.get("/stores/cash/:id", auth.isAuthorized, storeController.records); // submit available cash
router.get("/stores/summary/:id", auth.isAuthorized, storeController.summary); // Store summary
// Accouncements
router.post("/announcements", auth.isAuthorized, announcementController.add); // add new announcements
router.get("/announcements", auth.isAuthorized, announcementController.list); // announcements list
router.get(
  "/announcements/:userId",
  auth.isAuthorized,
  announcementController.getUsersAnncouncements
); // get announcement by app type
router.put(
  "/announcements/dismiss/:id",
  auth.isAuthorized,
  announcementController.updateAnnouncementLogById
); // get announcement by app
//upload file
router.post(
  "/uploadfile",
  auth.isAuthorized, upload.single("document"),
  storeController.uploadFile
); // get announcement by app
router.post("/accounts/entries", auth.isAuthorized, accountsController.create); // create account entry
router.get("/accounts/entries", auth.isAuthorized, accountsController.list); // create account entry
// offer
router.post("/offers", auth.isAuthorized, offerController.createOffer); // create offer
router.get("/offers", auth.isAuthorized, offerController.listOffer); // list offer
router.patch("/offers", auth.isAuthorized, offerController.updateOffer); // update offer
router.post("/offers/segments", auth.isAuthorized, offerController.createSegment); // create segment
router.get("/offers/segments", auth.isAuthorized, offerController.listSegment); // list segment
router.patch("/offers/segments", auth.isAuthorized, offerController.updateSegment); // update segment
router.post("/offers/coupons", auth.isAuthorized, offerController.createCoupon); // create Coupons
router.get("/offers/coupons", auth.isAuthorized, offerController.listCoupon); // list Coupons
router.patch("/offers/coupons", auth.isAuthorized, offerController.updateCoupon); // update Coupons
router.post("/offers/campaigns", auth.isAuthorized, offerController.createCampaign); // create Campaigns
router.get("/offers/campaigns", auth.isAuthorized, offerController.listCampaign); // list Campaigns
router.patch("/offers/campaigns", auth.isAuthorized, offerController.updateCampaign); // update Campaigns
router.post("/offers/campaigns/search", auth.isAuthorized, offerController.searchCampaign); // create Campaign Search request
router.get("/delivery-options/:storeId", auth.isAuthorized, deliveryController.availability); // check if delivery is enable
router.post("/delivery-options", auth.isAuthorized, deliveryController.createOption); // check if delivery is enable
router.put("/delivery-items/status-update", auth.isAuthorized, deliveryController.updateStatus); // update delivery status
router.get("/delivery-items", auth.isAuthorized, deliveryController.deliveryList); // delivery list
router.post("/delivery-items", auth.isAuthorized, deliveryController.createItem); // create delivery item
router.get("/delivery-items/store/:id", auth.isAuthorized, deliveryController.deliveryListByStore); // delivery list
router.get("/delivery-items/rider/:id", auth.isAuthorized, deliveryController.deliveryListByRider); // delivery list
module.exports = router;
