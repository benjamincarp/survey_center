var app = require('../app');

var answerRoutes = {
	getOne: function(req, res, next){
		//helpers.populateParamDocs did all the work for this route, just return the JSON for the answer if we found it
		return res.json(req.answer.toJSON());
	},

	getAll: function(req, res, next){
		app.db.models.Answer.find({}).sort({sort_order: 1}).exec(function(err,answers){
			if (err) return next(err);

			//convert the array of docs into an array of json objects
			for(var i=0; i<answers.length; i++){
				answers[i]=answers[i].toJSON();
			}

			return res.json(answers);
		});
	},

	update: function(req, res, next){
		//update any passed fields,
		//a loop to set any editable fields in the model that were passed in the body would be good if we had a bigger object
		//with only 2 possible fields to change, this is a lot less code.
		if (req.body && req.body.text) req.answer.text = req.body.text;
		if (req.body && req.body.sort_order) req.answer.sort_order = req.body.sort_order;

		req.answer.save(function(err,_answer) {
			if (err) return next(err);

			return res.json(_answer.toJSON());
		});
	},

	create: function(req, res, next){
		//check for required field
		if (!req.body || !req.body.text) {
			var err = new Error("The field 'text' is required to create a answer.");
			err.status = 400;
			return next(err);
		}

		//create the answer model
		var data = {
			text: req.body.text,
			question: req.question._id
		};

		if (req.body.sort_order) data.sort_order = req.body.sort_order;

		var answer = new app.db.models.Answer(data);

		return answer.save(function(err,_answer) {
			if (err) return next(err);

			return res.json(_answer.toJSON());
		});
	},

	delete: function(req, res, next){
		req.answer.delete(function(err, _answer){
			if (err) return next(err);

			return res.json(_answer.toJSON());
		});
	}
};

module.exports = answerRoutes;
