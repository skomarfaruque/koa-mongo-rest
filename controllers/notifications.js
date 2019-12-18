"use strict";
const notificationModel = require('../models/notificationModel');
const errorResponseHandler = require('../middlewares/errorResponseHandler');
const stringifySafe = require("../Helpers/stringifySafe");
const mobileNumberFormat = require('../Helpers/mobileNumberFormat');
const validator = require('validatorjs');
// const fetch = require("isomorphic-fetch");
const variables = require('../variables');
const rules = () => (
    {
        mobile: ['required', 'regex:/(^(\\+8801|8801|01|1|008801))[1|5-9]{1}(\\d){8}$/'],
        type: ['required'],
        email: ['required', 'email']
    }
);

const isValid = (req) => {
    let expectedRules = {};
    const requestedData = new Map(Object.entries(req));
    requestedData.forEach((data, key) => {
        if (key in rules() === true) {
            Object.assign(expectedRules, {[key]: rules()[key]});
        }
      });
    const validation = new validator(req, expectedRules);
    if(!validation.passes()) {
        throw ({status: 400, message: 'Invalid Input.', data: validation.errors.all()})
    };
};
exports.sendVerificationCode = async(ctx) => {
    try{
        const body = ctx.request.body;
        const type = body.type;
        isValid({type});
        if (type === 'sms') {
            const data = {mobile: body.mobile};
            isValid(data);
            body.mobile = await mobileNumberFormat(body.mobile);
            const sixDigitCode = Math.floor(100000 + Math.random() * 900000)
            const sendMessage = await notificationModel.sendVerificationCode({mobile: body.mobile,sixDigitCode});
            if (sendMessage.status !== 200) {
                throw({status: 400, message: 'Sms Sending Error.'})
            }
            const responseText = {verificationCode: sixDigitCode}
            ctx.response.ok(responseText, "Sms Sent.");
        } else {
            const data = {email: body.email};
            isValid(data);
            const err = {status: 501, message: 'Not implemented yet'};
            ctx.log.error(stringifySafe(err, null, 2));
            errorResponseHandler(ctx, err);
        }
        
    } catch (err) {
        ctx.log.error(stringifySafe(err, null, 2));
        errorResponseHandler(ctx, err);
    }
};
exports.sendPushNotifications = async(ctx) => {
    let response = await fetch('https://fcm.googleapis.com/fcm/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `key=${variables.firebaseAuthKeyMobile}`
            },
            body: JSON.stringify({
                to:"c6tOqV2rv_U:APA91bGDEppvRuGWg2JTyliaJIGpWYc4sJ9i0IQGacRryCnrTkAgD_1yWQx-efjVE35dtoZuG8MbLdWwFuW8XdE6o6VkZLn2frwTWVAD3_6BKhXTDIww7FcQrRfdSmlgJPLzB5dcdkzOyoAQBU0jPyFLCJPGcu1BEw",
                "channelId": "demo",
                data: {
                    custom_notification:  {title: 'Test',
                    body: 'User has a comment for you.',
                    sound: 'default',
                    badge: '1',
                    content_available: true,
                    show_in_foreground: true,
                    priority: "high",
                    "channelId": "demo"
                }
                },
                "notification": {
                    "title": "Tong",
                    "body" : "Your order is ready to pickup.",
                    "text": "Text",
                    icon: "ic_launcher",
                    "sound": "default",
                    "channelId": "demo",
                    "show_in_foreground": true
                }
            })
        })
};
