
const variables = require('../variables');
const user = require('../Schema/user');
const axios = require('axios');
const fetch = require('isomorphic-fetch');
exports.sendVerificationCode = async(request) => {
    const url = `${variables.smsGatewayURL}send?userid=${variables.smsGatewayUser}&password=${variables.smsGatewayPassword}&recipient=${request.mobile}&sender=TONG&body=Your SMS Verification Code is: ${request.sixDigitCode}`;
    const response = await axios.get(
        url
    )
    .then(res => res)
    .catch(error => {
        throw(error.response);
    });
    return response;
};
exports.sendPushToCook = async(request) => {
    const getDeviceToken = await user.find( {$or: [
        { 'userType': 3 },
        { 'userType': 4 }
      ]}).select('deviceToken');
    await getDeviceToken.map( async(userData) => {
        await fetch('https://fcm.googleapis.com/fcm/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `key=${variables.firebaseAuthKey}`
            },
            body: JSON.stringify({
                to: userData.deviceToken,
                notification: {
                    body: JSON.stringify(request)
                },
                data: {
                    custom_notification: JSON.stringify({
                    body: "You have a new Order",
                    title: "New Order",
                    color:"#00ACD4",
                    priority:"high",
                    icon:"ic_notif",
                    group: "GROUP",
                    sound: "default",
                    id: "id",
                    show_in_foreground: false
                    })
                }
            })
        })
    })
};
exports.sendFeedbackPushToCustomer = async(customerToken, orderId) => {
     const fireRes = await fetch('https://fcm.googleapis.com/fcm/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `key=${variables.firebaseAuthKeyMobile}`
            },
            body: JSON.stringify({
                to:customerToken,
                channelId: "demo",
                data: {
                    custom_notification: orderId,
                    notificationType: 'feedbackRequest',
                    clickAction: 'addLatestOrderInStore'
                },
                notification: {
                    "title": "Tong",
                    "body" : `You have a feedback request`,
                    "text": "Text",
                    icon: "ic_launcher",
                    "sound": "default",
                    "channelId": "demo",
                    "show_in_foreground": true
                }
            })
        });
       return fireRes;
};