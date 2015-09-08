var express = require('express');
var app = require('../app');
var async = require('async');

var responseRoutes = {
	getOne: function(req, res, next){
		//helpers.populateParamDocs did all the work for this route, just return the JSON for the response if we found it
		return res.json(req.response.toJSON());
	},

	getAll: function(req, res, next){
		app.db.models.Response.find({},function(err,responses){
			if (err) return next(err);

			//convert the array of docs into an array of json objects
			for(var i=0; i<responses.length; i++){
				responses[i]=responses[i].toJSON();
			}

			return res.json(responses);
		});
	},

	update: function(req, res, next){
		//responses can't be updated
		var err = new Error("Responses are not editable.");
		err.status = 405;
		return next(err);
	},

	create: function(req, res, next){
		var data = {
			question: req.question._id,
			answer: req.answer._id
		};
		var response = new app.db.models.Response(data);

        async.series([
                function(series_cb){
                    return response.save(function(err,_response) {
                        if (err) return series_cb(err);

                        response = _response;
						return series_cb();
                    });
                },
                function(series_cb){
                    //recalculate the response counts for this answer (self healing rather than incrementing)
                    return req.answer.updateCount(series_cb);
                }
            ],
            function(err){
                if (err) return next(err);

                return res.json(response.toJSON());
            }
        );
	},

	delete: function(req, res, next){
		var response = req.response;

        async.series([
                function(series_cb){
                    return response.remove(series_cb);
                },
                function(series_cb){
                    //recalculate the response counts for this answer (self healing rather than decrementing)
                    return req.answer.updateCount(series_cb);
                }
            ],
            function(err){
                if (err) return next(err);

                return res.json(response.toJSON());
            }
        );
	}
};

module.exports = responseRoutes;
