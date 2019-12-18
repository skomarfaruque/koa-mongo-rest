const axios = require('axios');
const logger = require('../logger');
const toFormData = require("json-to-form-data");
exports.initiate = async (url, request) => {
    const response = await axios.post(url, toFormData(request))
        .then(res => res.data)
    return response;
};
exports.validate = async (url) => {
    const response = await axios.get(url)
        .then(res => res.data)
    return response;
};