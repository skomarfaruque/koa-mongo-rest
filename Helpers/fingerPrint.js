"use strict"
const crypto = require('crypto')
module.exports = async(data) => {
    const obj = {
        mobile: data.mobile,
        deviceBrand: data.deviceBrand,
        deviceId: data.deviceId,
        deviceName: data.deviceName,
        deviceModel: data.deviceModel,
        deviceUniqueId: data.deviceUniqueId,
    }
    let sum = ''
    for( var el in obj ) {
      if( obj.hasOwnProperty( el ) ) {
        sum += obj[el]
      }
    }
    const cryptoFingerPrint = await crypto.createHash('md5').update(sum).digest("hex");
    return cryptoFingerPrint;
}