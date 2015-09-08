var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var app = require('../app');
var async = require('async');

var answerSchema = new Schema({
	//_id is works better if left implied rather than defined in mongoose
	text: 			{type: String, required: true},												//the answer to show the user
	sort_order:		{type: Number, required: true, default: 99},								//index used to sort answers in a question, in general lower sort_order answers will be first
	question: 		{type: Schema.Types.ObjectId, ref: 'question', required: true},	//back pointer to the question that this answer belongs to
	response_count: {type: Number, required: true, default: 0},									//the count of times this answer has been selected so far
	creation_date:  {type: Date, required: true, default: Date.now}    							//the date the answer was added, will be set automatically
});

answerSchema.virtual('uri').get(function () {
	return '/questions/' + this.question + '/answers/' + this._id;
});


//updates the count in the answer model to reflect how many responses point to it
//callback returns any errors and the passed answer model
answerSchema.methods.updateCount = function(callback) {
	var answer = this;

	async.series([
			function (series_cb) {
				//count the responses that point to this answer
				return app.db.models.Response.find({answer: answer._id}).count(function(err, count){
                    if (err) return series_cb(err);

                    answer.response_count = count;
					return series_cb();
                });
			},
			function (series_cb) {
				//now save the answer model
				return answer.save(series_cb);
			}
		],
		function (err) {
			return callback(err, answer);
		}
	);
};

//deletes the answer model and all of the responses that point to it
//callback returns any errors and the passed answer model
answerSchema.methods.delete = function (callback) {
	var answer = this;

	async.series([
			function (series_cb) {
				//delete the responses that point to this answer
				return app.db.models.Response.remove({answer: answer._id}, series_cb);
			},
			function (series_cb) {
				//now delete the answer model
				return answer.remove(series_cb);
			}
		],
		function (err) {
			return callback(err, answer);
		}
	);
};

app.db.model('Answer', answerSchema);
