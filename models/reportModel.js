"use strict";
const dailyStocksReport = require('../Schema/dailyStocksReport');
const mongoose = require('mongoose');
exports.create = async (request) => {
	const response = await dailyStocksReport.create(request);
	return response;
};
exports.checkDailyReportRecordToday = async (storeId, filter) => {
	const now = new Date();
	const today = filter.start ? new Date(filter.start) : new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const tomorrow = filter.end ? new Date(filter.end) : new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
	const response = await dailyStocksReport.find({ 'storeId': mongoose.Types.ObjectId(storeId), 'createdAt': { $gte: today, $lt: tomorrow } }).populate({ path: 'storeId' }).populate({ path: 'userId' }).populate({ path: 'items.id' });
	return response;
};
exports.updateDailyReport = async (request) => {
	const response = await dailyStocksReport.update({ '_id': mongoose.Types.ObjectId(request.id) }, { $set: { items: request.items } })

	return response;
};
