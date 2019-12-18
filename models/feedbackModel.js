"use strict";
const feedbackQuestions = require('../Schema/feedbackQuestion');
const feedbackAnswers = require('../Schema/feedbackAnswer');
exports.create = async(request) => {
    const response = await feedbackQuestions.create(request);
    return response;
};
exports.updateQuestion = async(req, questionId) => {
    const response = await feedbackQuestions.findOneAndUpdate({_id: questionId}, req, {new: true});
    return response;
};
exports.deleteQuestion = async(questionId) => {
    const response = await feedbackQuestions.deleteOne({_id: questionId});
    return response;
};
exports.addAnswer = async(request) => {
    const response = await feedbackAnswers.create(request);
    return response;
};
exports.getList = async() => {
    const response = await feedbackQuestions.aggregate([
        {
            $match: { "publishStatus": 1 }
        },
        { $sort : { questionSequence : 1 } },
        { 
            $project : { 
                'createdAt': 0, 'updatedAt': 0, '__v': 0, 'items._id': 0
            } 
        }
     ]);
    return response;
};
