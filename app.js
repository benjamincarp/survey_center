var path = require('path');
var engines = require('consolidate');
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');

var express = require('express');
var app = express();

//setup the database connection
var mongoose = require('mongoose');
app.db = mongoose.createConnection('localhost', 'surveys', 27017);

//needed to populate req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//export the app so other files can require it
module.exports = app;

var question=require(__dirname + '/models/question.js');
var answer=require(__dirname + '/models/answer.js');
var response=require(__dirname + '/models/response.js');

// view engine setup
app.set('views', path.join(__dirname, 'public/templates'));
app.engine('hjs', engines.hogan);
app.set('view engine', 'hjs');

//configure express
app.set('title','survey_center');

//middleware to populate base locals for the view templates
app.use(function(req, res, next){
    res.locals={
        partials: {
            header: 'header',
            footer: 'footer'
        }
    };

    return next();
});

//serve up the static files in the public folder
app.use(express.static(__dirname + '/public'));

//use the router for all valid requests
var router = require('./routes/index');
app.use('/',router);

//Generic error handling
app.use(function(err, req, res, next){
    //set the default status and messages if we're missing either
    if (!err.status) err.status = 500;
    if (!err.message) {
        switch(err.status){
            case 404:
                err.message = "We can't find what you're looking for.";
                break;
            case 500:
            default:
                err.message = "Something broke.";
        }
    }

    console.error(err.stack);
    res.status(err.status).send(err.message);
});

//404 handling
app.use(function(req, res, next){
    res.status(404).send("We can't find what you're looking for.");
});

//start the server
var server = app.listen(3000, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Survey Center is ready to quiz you at port %s', port);

});
