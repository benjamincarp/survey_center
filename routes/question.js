var app = require('../app');

var questionRoutes = {
	getOne: function(req, res, next){
        var question = req.question.toJSON();

		if (!req.query || !(req.query.include_answers === 'true')) {
            //helpers.populateParamDocs did all the work for this route, just return the JSON for the question if we found it
            return res.json(question);
        }

        //if the query string requested answers, then include the answer array in the returned JSON

        //get all the answer models that point to this question
        app.db.models.Answer.find({question: question._id}).sort({sort_order: 1}).exec(function(err, answers){
            if (err) return series_cb(err);

            //convert the answer models to JSON
            for (var i=0; i<answers.length; i++){
                answers[i] = answers[i].toJSON();
            }

            //now that both the quesiton and the answer array are in JSON format, add the answers and return
            question.answers = answers;
            return res.json(question);
        });
	},

	getAll: function(req, res, next){
		app.db.models.Question.find({},function(err,questions){
			if (err) return next(err);

			//convert the array of docs into an array of json objects
			for(var i=0; i<questions.length; i++){
				questions[i]=questions[i].toJSON();
			}

			return res.json(questions);
		});
	},

	update: function(req, res, next){
		//check for required field
		if (!req.body || !req.body.text) {
			var err = new Error("The field 'text' is required to edit a question.");
			err.status = 400;
			return next(err);
		}

		//text is the only field you can change here
		req.question.text = req.body.text;

		req.question.save(function(err,_question) {
			if (err) return next(err);

			return res.json(_question.toJSON());
		});
	},

	create: function(req, res, next){
		//check for required field
		if (!req.body || !req.body.text) {
			var err = new Error("The field 'text' is required to create a question.");
			err.status = 400;
			return next(err);
		}

		var question = new app.db.models.Question({text: req.body.text});
		return question.save(function(err,_question) {
			if (err) return next(err);

			return res.json(_question.toJSON());
		});
	},

	delete: function(req, res, next){
		req.question.delete(function(err,_question){
			if (err) return next(err);

			return res.json(_question.toJSON());
		});
	}
};

module.exports = questionRoutes;
