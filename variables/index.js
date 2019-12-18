// CRM index
const env = process.env.APP_ENV;
const appPort = process.env.APP_PORT;
const comissionRate = process.env.SALES_COMISSION_RATE;
const host = process.env.HOST || "localhost";
const apiToken = process.env.API_TOKEN;
const loggerName = process.env.LOGGER_NAME;
const logLevel = process.env.LOG_LEVEL;
const smsGatewayUser = process.env.SMS_GATEWAY_USERNAME;
const smsGatewayPassword = process.env.SMS_GATEWAY_PASSWORD;
const smsGatewayURL = process.env.SMS_GATEWAY_URL;
const mongoDb = process.env.MONGODDB || "localhost";
const passwordLength = process.env.PASSWORD_LENGTH || 6;
const contryCode = process.env.COUNTRY_CODE || "+88";
const schemaDirectory = process.env.SCHEMA_DIRECTORY;
const orderQueueLimit = process.env.ORDER_QUEUE_LIMIT;
const firebaseAuthKey = process.env.FIRBASE_AUTH_KEY;
const firebaseAuthKeyMobile = process.env.FIRBASE_AUTH_KEY_MOBILE;
const mostRecentLimit = process.env.MOST_RECENT_LIMIT;
const mostFrequentLimit = process.env.MOST_FREQUENT_LIMIT;
const awsRegion = process.env.AWS_REGION;
const sqsUrl = process.env.SQS_URL;
const awsAccessKey = process.env.AWS_ACCESS_KEY;
const awsSecretKey = process.env.AWS_SECRET_ACCESS_KEY;
const awsS3Bucket = process.env.AWS_BUCKET;
const awsS3AccountsBucket = process.env.AWS_BUCKET_ACCOUNTS;
const awsS3Acl = process.env.AWS_S3_ACL;
const push = {
  appId: "631903",
  key: "6aae40a4b0b31a87bce0",
  secret: "b9fd116a3505ef81fc9f",
  cluster: "ap2"
};
const sqsFeedbackUrl = process.env.SQS_FEEDBACK_URL;
const paymentProfile = {
  id: process.env.SSLCMZ_STORE_ID,
  password: process.env.SSLCMZ_STORE_PASS,
  currency: "BDT",
  notifyURL: process.env.SSLCMZ_NOTIFY_URL,
  paymentURL: process.env.SSLCMZ_PAYMENT_URL,
  validatorURL: process.env.SSLCMZ_VALIDATOR_URL,
  defaultEmail: process.env.SSLCMZ_DEFAULT_EMAIL
};
const variables = {
  appPort,
  env,
  host,
  mongoDb,
  apiToken,
  comissionRate,
  loggerName,
  logLevel,
  smsGatewayUser,
  smsGatewayPassword,
  smsGatewayURL,
  passwordLength,
  contryCode,
  schemaDirectory,
  orderQueueLimit,
  firebaseAuthKey,
  firebaseAuthKeyMobile,
  mostRecentLimit,
  mostFrequentLimit,
  awsRegion,
  sqsUrl,
  push,
  sqsFeedbackUrl,
  paymentProfile,
  awsAccessKey,
  awsSecretKey,
  awsS3Bucket,
  awsS3Acl,
  awsS3AccountsBucket
};

module.exports = variables;
