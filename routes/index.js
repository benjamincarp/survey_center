var express = require('express');
var app = require('../app');

var router = express.Router();

//force all URLs to lower case
app.use(require('express-uncapitalize')());

//hand off all the api routes to a separate router for CRUD operations with JSON responses
router.use('/api', require('./api'));

//we only have one route that returns HTML so I'm just going to put it here instead of in another file
router.get('/',function(req,res,next){
    //for now, just find any one question and roll with it.
    //you could present a menu of questions or you could return a random question form the collection easily as well
    app.db.models.Question.findOne({}, function(err,question){
        if (err) return next(err);

        if(!question) return res.render('index'); //render our index page with no question if we can't find one

        //get the question and it's answers in JSON format
        question.toJsonWithAnswers(function(err, _question){
            if (err) return next(err);

            //make the question available to the hogan templates
            //but only if the question has some answers
            if (_question && _question.answers && (_question.answers.length>0)) res.locals.question = _question;

            res.render('index'); //render our index page
        });
    });


});


module.exports = router;
