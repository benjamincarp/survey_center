var express = require('express');
var app = require('../app');

var router = express.Router();

//force all URLs to lower case
app.use(require('express-uncapitalize')());

//hand off all the api routes to a separate router for CRUD operations with JSON responses
router.use('/api', require('./api'));

//handle the routes that return HTML here
router.get('/',function(req,res,next){
	res.status(200).send("Default Route");
 	//res.render('index');
});


module.exports = router;
