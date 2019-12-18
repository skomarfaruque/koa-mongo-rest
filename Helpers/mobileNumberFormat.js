"use strict"
const variables = require('../variables'); 
module.exports = (mobile) => {
    const mobileNumberFormat = `${variables.contryCode}${mobile.substring(mobile.length - 10, mobile.length)}`;
    return mobileNumberFormat;
}