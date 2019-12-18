"use strict"
const crypto = require('crypto')
module.exports = (password) => {
    const encryptedPassword = crypto.createHash('md5').update(password).digest("hex");
    return encryptedPassword;
}