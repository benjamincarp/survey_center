var app = require('../app');
var async = require('async');

var helpers = {
    populateParamDocs: function (req, res, next) {
        async.series([
                function (cb) {
                    if (!req.params.questionID) return cb();

                    app.db.models.Question.findOne({_id: req.params.questionID}, function (err, question) {
                        if (err) return cb(err);

                        //can't find the question so return an error
                        if (!question) {
                            var err = new Error("Invalid question ID.");
                            err.status = 404;
                            return cb(err);
                        }

                        //store the question doc in the request for easy access later
                        req.question = question;

                        return cb();
                    });
                },
                function (cb) {
                    if (!req.params.answerID) return cb();

                    app.db.models.Answer.findOne({_id: req.params.answerID}, function (err, answer) {
                        if (err) return cb(err);

                        //can't find the answer so return an error
                        if (!answer) {
                            var err = new Error("Invalid answer ID.");
                            err.status = 404;
                            return cb(err);
                        }

                        //store the answer doc in the request for easy access later
                        req.answer = answer;

                        return cb();
                    });
                },
                function (cb) {
                    if (!req.params.responseID) return cb();

                    app.db.models.Response.findOne({_id: req.params.responseID}, function (err, response) {
                        if (err) return cb(err);

                        //can't find the response so return an error
                        if (!response) {
                            var err = new Error("Invalid response ID.");
                            err.status = 404;
                            return cb(err);
                        }

                        //store the response doc in the request for easy access later
                        req.response = response;

                        return cb();
                    });
                }
            ],
            function (err) {
                return next(err);
            }
        );
    }
};

module.exports = helpers;
