var express = require('express');
var app = require('../app');
var helpers = require('./helpers');

var router = express.Router();

//Response Routes ====================================================
var responseRoutes = require('./response');
router.get('/questions/:questionID/answers/:answerID/responses/:responseID', helpers.populateParamDocs, responseRoutes.getOne);
router.delete('/questions/:questionID/answers/:answerID/responses/:responseID', helpers.populateParamDocs, responseRoutes.delete);
router.put('/questions/:questionID/answers/:answerID/responses/:responseID', helpers.populateParamDocs, responseRoutes.update);
router.get('/questions/:questionID/answers/:answerID/responses', helpers.populateParamDocs, responseRoutes.getAll);
router.post('/questions/:questionID/answers/:answerID/responses', helpers.populateParamDocs, responseRoutes.create);

//Answer Routes ====================================================
var answerRoutes = require('./answer');
router.get('/questions/:questionID/answers/:answerID', helpers.populateParamDocs, answerRoutes.getOne);
router.delete('/questions/:questionID/answers/:answerID', helpers.populateParamDocs, answerRoutes.delete);
router.put('/questions/:questionID/answers/:answerID', helpers.populateParamDocs, answerRoutes.update);
router.get('/questions/:questionID/answers', helpers.populateParamDocs, answerRoutes.getAll);
router.post('/questions/:questionID/answers', helpers.populateParamDocs, answerRoutes.create);

//Question Routes ==================================================
var questionRoutes = require('./question');
router.get('/questions/:questionID', helpers.populateParamDocs, questionRoutes.getOne);
router.delete('/questions/:questionID', helpers.populateParamDocs, questionRoutes.delete);
router.put('/questions/:questionID', helpers.populateParamDocs, questionRoutes.update);
//no need for the helper funciton on these 2 routes since they have no URL params
router.get('/questions', questionRoutes.getAll);
router.post('/questions', questionRoutes.create);


module.exports = router;
