var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var app = require('../app');

var responseSchema = new Schema({
	//_id is works better if left implied rather than defined in mongoose
	question: 		{type: Schema.Types.ObjectId, ref: 'question', required: true},	//the question that this answer belongs to
	answer: 		{type: Schema.Types.ObjectId, ref: 'answer', required: true},		//the answer that the user submitted
	creation_date:  {type: Date, required: true, default: Date.now}    							//the date the answer was added, will be set automatically
	//if you had people log in, you could tie their response to their account here with a user property
	//otherwise, you could also collect and store other demographic info here like age, sex, or locataion
});

responseSchema.virtual('uri').get(function () {
  return 'api/questions/' + this.question + '/answers/' + this.answer + '/responses/' + this._id;
});

app.db.model('Response', responseSchema);
