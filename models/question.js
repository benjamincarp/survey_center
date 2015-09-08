var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var async = require('async');
var _ = require('underscore');
var app = require('../app');

var schemaOptions = {       //set if virtuals are returned by default in toObject and toJSON calls
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
};

var questionSchema = new Schema({
    //_id is works better if left implied rather than defined in mongoose
    text: 			{type: String, required: true},					 							//the quesiton to show the user
    creation_date:  {type: Date, required: true, default: Date.now},   							//the date the question was added, will be set automatically
},
    schemaOptions
);

questionSchema.virtual('uri').get(function () {
  return '/questions/' + this._id;
});

//deletes the question model and all of the answers and responses that point to it
//callback returns any errors and the passed question model
questionSchema.methods.delete = function (callback) {
    var question = this;

    async.series([
            function (series_cb) {
                //delete the answers that point to this question
                return app.db.models.Answer.remove({question: question._id}, series_cb);
            },
            function (series_cb) {
                //delete the responses that point to this question
                return app.db.models.Response.remove({question: question._id}, series_cb);
            },
            function (series_cb) {
                //now delete the question model
                return question.remove(series_cb);
            }
        ],
        function (err) {
            return callback(err, question);
        }
    );
};

//Get the JSON of this model with embedded answer models
//callback returns any errors and the JSON version of this model with an embedded array of the quesiton's answers
questionSchema.methods.toJsonWithAnswers = function (callback) {
    var question = this.toJSON();

    app.db.models.Answer.find({question: this._id}).sort({sort_order: 1}).exec(function(err, answers){
        if (err) return callback(err);

        //convert the answer models to JSON
        for (var i=0; i<answers.length; i++){
            answers[i] = answers[i].toJSON();
        }

        //now that both the quesiton and the answer array are in JSON format, add the answers and return
        question.answers = answers;
        return callback(null, question);
    });
};

app.db.model('Question', questionSchema);
