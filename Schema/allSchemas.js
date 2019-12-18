const categorySchema = {
    name: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
};
const productSchema = {
    categoryId: { type: "ObjectId", ref: "category" },
    name: String,
    sku: String,
    productInitial: String,
    description: String,
    individuallySold: {
        type: Boolean,
        default: true
    },
    posOnly: {
        type: Boolean,
        default: false
    },
    enablePoints: {
        type: Boolean,
        default: false
    },
    cashback: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        default: 0
    },
    attributes: [
        {
            name: String,
            options: [
                {
                    name: String,
                    price: Number,
                    isDefault: {
                        type: Boolean,
                        default: false
                    }
                }
            ]
        }
    ],
    addons: [
        {
            id: { type: "ObjectId", ref: "products" }
        }
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
};
const customers = {
    name: String,
    mobile: String,
    email: String,
    photo: String,
    fbId: String,
    googleId: String,
    password: String,
    balance: {
        type: Number,
        default: 0
    },
    age: String,
    gender: String,
    walletNumber: Number, // 16 digit unique
    mobileVerified: {
        type: Boolean,
        default: false
    },
    source: {
        type: Number,
        default: 2
    }, // 1 means by app, 2 means by pos rest others.
    deviceToken: {
        type: String,
        default: null
    },
    address: [],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
};
const customerToken = {
    customerId: { type: "ObjectId", ref: "customer" },
    token: {
        type: String,
        default: null
    },
    deviceBrand: String,
    deviceId: String,
    deviceName: String,
    deviceModel: String,
    deviceIsEmulator: {
        type: Boolean,
        default: false
    },
    deviceIsTablet: {
        type: Boolean,
        default: false
    },
    deviceUniqueId: String,
    expireOn: {
        type: Date
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
};
const orders = {
    customerId: { type: "ObjectId", ref: "customer" },
    storeId: { type: "ObjectId", ref: "store" },
    items: [
        {
            itemId: { type: "ObjectId", ref: "products" },
            quantity: Number,
            name: String,
            price: Number,
            fingerPrint: String,
            attributes: [
                {
                    name: String,
                    id: String,
                    option: {
                        id: String,
                        name: String,
                        price: Number
                    }
                }
            ],
            addons: [
                {
                    id: { type: "ObjectId", ref: "products" }
                }
            ]
        }
    ],
    price: {
        type: Number,
        default: 0
    },
    orderQueue: {
        type: Number,
        default: 1
    },
    paymentMethod: {
        type: Number,
        default: 1 // 1 means cash, 2 means credit card, 3 mean wallet balance
    },
    orderStatus: {
        type: Number,
        default: 1 // 1 means pending 2 means progress, 3 means done 4 means cancel
    },
    itemsFingerPrint: String, // all items fingerprint
    feedbackRequested: {
        type: Boolean,
        default: false
    },
    feedbackReceived: {
        type: Boolean,
        default: false
    },
    specialInstruction: String,
    orderDate: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    orderSource: {
        type: Number,
        default: 1 // 1 means app, 2 means pos
    },
    cardFourDigit: {
        type: Number
    },
    cashPaid: {
        type: Number
    },
    cashChange: {
        type: Number
    },
    homeDelivery: {
        type: Boolean,
        default: false
    },
    createdAt: { type: Date, default: Date.now }
};
const stores = {
    name: String,
    address: String,
    mobile: String,
    isWareHouse: {
        type: Boolean,
        default: false
    },
    latitude: String,
    longitude: String,
    imageUrl: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
};
const shutters = {
    storeId: { type: "ObjectId", ref: "stores" },
    userId: { type: "ObjectId", ref: "users" },
    isOpen: {
        type: Boolean,
        default: true // true means shutter/selling on false means shutter/selling off
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
};
const users = {
    name: String,
    email: String,
    password: String,
    storeId: { type: "ObjectId", ref: "stores" },
    userType: {
        type: Number,
        Default: 1 // 1 means super user 2 means cashier 3 means cook
    },
    deviceToken: {
        type: String,
        default: null
    },
    role: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
};
const OrderProcessHistory = {
    orderId: { type: "ObjectId", ref: "customer" },
    processedBy: { type: "ObjectId", ref: "user" },
    orderStatus: {
        type: Number,
        default: 2 // 2 means in progress, 3 means completed/done 4 means cancled
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
};
const inventoryItems = {
    title: String,
    description: String,
    sku: String,
    unit: String,
    maxPrice: { type: Number },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
};
const feedbackQuestion = {
    title: String,
    questionSequence: {
        type: Number,
        default: 1
    },
    publishStatus: {
        type: Number,
        default: 1 // 1 means published, 0 means unpublished
    },
    questionType: {
        type: Number,
        default: 1 // 1 means input 2 means rating
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
};
const feedbackAnswer = {
    orderId: { type: "ObjectId", ref: "orders" },
    answers: [
        {
            questionId: { type: "ObjectId", ref: "feedbackquestion" },
            answer: String
        }
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
};
const inventoryStock = {
    itemId: { type: "ObjectId", ref: "inventoryitems" },
    storeId: { type: "ObjectId", ref: "stores" },
    quantity: {
        type: Number,
        default: 0
    },
    notificationQuantity: Number,
    itemUnit: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
};
const itemOptions = {
    itemId: { type: "ObjectId", ref: "inventoryitems" },
    name: String,
    price: Number,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
};
const productStores = {
    productId: { type: "ObjectId", ref: "products" },
    storeId: { type: "ObjectId", ref: "stores" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
};
const productAttributes = {
    name: String,
    options: [],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
};
const productOptions = {
    productId: { type: "ObjectId", ref: "products" },
    options: [],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
};
const productItems = {
    productId: { type: "ObjectId", ref: "products" },
    itemId: { type: "ObjectId", ref: "inventoryitems" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
};
const itemMapper = {
    productId: { type: "ObjectId", ref: "products" },
    permutation: String,
    itemMap: [],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
};
const vendors = {
    name: String,
    address: String,
    phone: String,
    contactName: String,
    contactNumber: String,
    description: String,
    isDeleted: {
        type: Boolean,
        default: false
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
};
const purchaseOrders = {
    userId: { type: "ObjectId", ref: "users" },
    storeId: { type: "ObjectId", ref: "stores" },
    vendorId: { type: "ObjectId", ref: "vendors" },
    poNumber: String,
    poRef: String,
    requisitionId: { type: "ObjectId", ref: "requisition" },
    requisitioner: { type: "ObjectId", ref: "users" },
    approver: { type: "ObjectId", ref: "users" },
    reason: String,
    changeRequest: String,
    authoriser: { type: "ObjectId", ref: "users" },
    status: {
        type: String,
        enum: ["PENDING", "APPROVED", "REJECTED", "MODIFIED", "PROCESSED"]
    },
    shipping: {
        terms: String,
        method: String
    },
    items: [
        {
            id: { type: "ObjectId", ref: "inventoryitems" },
            quantity: Number,
            unitPrice: Number
        }
    ],
    specialInstruction: String,
    isDeleted: {
        type: Boolean,
        default: false
    },
    quotation: String,
    bill: String,
    isOpen: { type: Boolean, default: true },
    closingNote: String,
    closedBy: { type: "ObjectId", ref: "users" },
    closedOn: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
};
const inventoryItemTransfers = {
    source: { type: "ObjectId", ref: "stores" },
    destination: { type: "ObjectId", ref: "stores" },
    userId: { type: "ObjectId", ref: "users" },
    status: {
        type: String,
        default: "pending"
    },
    items: [
        {
            id: { type: "ObjectId", ref: "inventoryitems" },
            quantity: Number
        }
    ],
    description: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
};
const salesOrders = {
    orderId: { type: "ObjectId", ref: "orders" },
    userId: { type: "ObjectId", ref: "users" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
};
const userAttendences = {
    storeId: { type: "ObjectId", ref: "stores" },
    userId: { type: "ObjectId", ref: "users" },
    status: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
};
const dailyStocksReport = {
    userId: { type: "ObjectId", ref: "users" },
    storeId: { type: "ObjectId", ref: "stores" },
    items: [
        {
            id: { type: "ObjectId", ref: "inventoryitems" },
            quantity: Number
        }
    ],
    event: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
};
const charities = {
    orderId: { type: "ObjectId", ref: "orders" },
    amount: { type: "Number", default: 0.0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
};
const payment = {
    total_amount: Number,
    currency: String,
    tran_id: String,
    cus_id: { type: "ObjectId", ref: "customer" },
    cus_name: String,
    cus_email: String,
    cus_phone: String,
    cart: [
        {
            product: String,
            amount: Number
        }
    ],
    product_amount: Number,
    status: String,
    failedreason: String,
    sessionkey: String,
    GatewayPageURL: String,
    val_id: String,
    store_amount: Number,
    card_type: String,
    card_no: String,
    bank_tran_id: String,
    card_issuer: String,
    card_brand: String,
    card_issuer_country: String,
    currency_type: String,
    currency_amount: String,
    currency_rate: String,
    varify_sign: String,
    verify_key: String,
    risk_level: String,
    risk_title: String,
    txn_flow: String,
    tran_date: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
};
const availableCash = {
    eventId: String,
    userId: { type: "ObjectId", ref: "users" },
    storeId: { type: "ObjectId", ref: "stores" },
    cashNotes: [
        {
            name: String,
            quantity: Number
        }
    ],
    event: String,
    totalAmount: Number,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
};
const announcements = {
    text: String,
    appType: {
        type: String,
        enum: ["MCOMMERCE", "POS", "KDS"]
    },
    validTill: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
};
const announcementLogs = {
    announcement: { type: "ObjectId", ref: "announcements" },
    user: { type: "ObjectId", ref: "externalModelType" },
    externalModelType: {
        // this is for dynamic binding with user as user may admin or customer
        type: String,
        enum: ["customers", "users"]
    },
    deliveredOn: { type: Date, default: Date.now },
    dismissedOn: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
};
const requisition = {
    storeId: { type: 'ObjectId', ref: 'stores' },
    requisitioner: { type: "ObjectId", ref: "users" },
    authoriser: { type: "ObjectId", ref: "users" },
    items: [
        {
            id: { type: "ObjectId", ref: "inventoryitems" },
            quantity: Number
        }
    ],
    status: {
        type: String,
        enum: ["PENDING", "APPROVED", "REJECTED", "MODIFIED"],
        default: "PENDING"
    },
    po: { type: 'ObjectId', ref: 'purchaseOrder' },
    reason: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
};
const accounts = {
    poId: { type: "ObjectId", ref: "purchaseorders" },
    accountant: { type: "ObjectId", ref: "users" },
    paidTo: { type: "ObjectId", ref: "users" },
    total: Number,
    paid: Number,
    file: String,
    comments: String,
    type: {
        type: String,
        enum: ["CASH-ENTRY", "REFUND",],
        default: "CASH-ENTRY"
    },
    refundReciept: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
};
const segments = {
    name: String,
    type: {
        type: String,
        enum: ['MASS', 'STORES', 'CATEGORIES', 'PRODUCTS', 'AGE-RANGE', 'NUMBER-OF-ORDERS', 'TOTAL-SPENDING', 'SPECIFIC-TIME', 'SPECIFIC-DAY', 'SIGNUP', 'ORDER-TOTAL']
    },
    referance: { type: "ObjectId", refPath: "externalModelType" },
    externalModelType: {
        type: String,
        enum: ["stores", "categories", "products"]
    },
    specific: {
        attribute: String,
        option: String,
        day: String
    },
    startRange: Number,
    endRange: Number,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
};
const offers = {
    name: String,
    type: { type: String, enum: ['FLAT', 'PERCENT', 'PRODUCT'] },
    product: { type: "ObjectId", ref: "products" },
    amount: Number,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
};
const coupons = {
    code: String,
    expired: { type: Boolean, default: false },
    expiredOn: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
};
const campaigns = {
    name: String,
    segment: { type: "ObjectId", ref: "segments" },
    offer: { type: "ObjectId", ref: "offers" },
    coupon: { type: "ObjectId", ref: "coupons" },
    channel: {
        type: String,
        enum: ["MCOMMERCE", "POS"]
    },
    deactivateLoyalty: Boolean,
    maxRedeem: Number,
    maxRedeemPerUser: Number,
    totalUsed: Number,
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
};
const offerClaimed = {
    campaign: { type: "ObjectId", ref: "campaigns" },
    store: { type: "ObjectId", ref: "stores" },
    customer: { type: "ObjectId", ref: "customer" },
    order: { type: "ObjectId", ref: "orders" },
    channel: {
        type: String,
        enum: ["MCOMMERCE", "POS"]
    },
    saves: Number,
    claimedOn: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
};
const delivery = {
    order: { type: "ObjectId", ref: "orders" },
    store: { type: "ObjectId", ref: "stores" },
    customer: { type: "ObjectId", ref: "customer" },
    rider: { type: "ObjectId", ref: "users" },
    comments: String,
    status: {
        type: String,
        enum: ["PENDING", "DELIVERING", "DELIVERED", "CANCELED"]
    },
    orderedOn: { type: Date, default: Date.now },
    assignedOn: { type: Date },
    acceptedOn: { type: Date },
    deliveredOn: { type: Date },
    canceledOn: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}
const deliverySettings = {
    storeId: { type: "ObjectId", ref: "stores" },
    minimumOrder: Number,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}
const allSchemas = {
    categorySchema,
    productSchema,
    customers,
    customerToken,
    orders,
    stores,
    users,
    OrderProcessHistory,
    inventoryItems,
    feedbackQuestion,
    feedbackAnswer,
    inventoryStock,
    itemOptions,
    productStores,
    productAttributes,
    productOptions,
    productItems,
    itemMapper,
    vendors,
    purchaseOrders,
    inventoryItemTransfers,
    salesOrders,
    userAttendences,
    dailyStocksReport,
    charities,
    shutters,
    payment,
    availableCash,
    announcements,
    announcementLogs,
    requisition,
    accounts,
    segments,
    offers,
    coupons,
    campaigns,
    offerClaimed,
    delivery,
    deliverySettings
};
module.exports = allSchemas;
