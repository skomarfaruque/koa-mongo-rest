const variables = require("../variables");
const AWS = require("aws-sdk");

// Set the region
AWS.config.update({ region: variables.awsRegion });
const queue = new AWS.SQS({ apiVersion: "2012-11-05" });

class sqs {
  static async createSalesOrder(ctx) {
    const sqs = ctx.sqs
    const body = { sqs };
    const messageParams = {
      MessageBody: JSON.stringify(body),
      QueueUrl: variables.sqsUrl
    };

    const sqsRequest = queue.sendMessage(messageParams);
    const sqsPromise = sqsRequest.promise();
    return sqsPromise.then(
      data => {
        return data;
      },
      error => {
        throw { message: "SQS Service Failed", error };
      }
    );
  }
  static async requestFeedback(ctx) {
    const sqs = ctx.sqs
    const body = { sqs };
    const messageParams = {
      MessageBody: JSON.stringify(body),
      QueueUrl: variables.sqsFeedbackUrl
    };

    const sqsRequest = queue.sendMessage(messageParams);
    const sqsPromise = sqsRequest.promise();
    return sqsPromise.then(
      data => {
        return data;
      },
      error => {
        throw { message: "SQS Service Failed", error };
      }
    );
  }
}
module.exports = sqs;
