"use strict"
const variables = require('../variables');
module.exports = async(data) => {
    let orderQueueOriginal = [];
    for(var a = 1; a <= variables.orderQueueLimit; a++) {
      orderQueueOriginal.push(a)
    }
    return orderQueueOriginal;
}