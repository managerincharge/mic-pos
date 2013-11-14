// Module dependencies.

var express = require('express');
var http = require('http');
var path = require('path');
var util = require('util');

var app = express();

var moment = require('moment');
// var Agenda = require('agenda');
// var ag = new Agenda({db: {address: 'mongodb://node:node@ds053188.mongolab.com:53188/node-test'}});
// ag.define('test agenda', function (job, done) {
// console.log('test agenda job executed');
// done();
// });
// ag.every('1 minute', 'test agenda');
// ag.start();


// load my settings
var settings = require('./settings')(app);

// load my modules
var helper = require('./app/helper.js')(settings, moment, util);
var firebase = require('./app/firebase.js')(helper);
var pos = require('./app/pos.js')(firebase, helper);
var commanding = require('./app/commanding.js')(firebase, helper, pos;

var routes = require('./routes');
var encDec = require('./routes/enc-dec.js')(helper);

// all environments
app.set('port', process.env.PORT || 1981);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// middleware
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.configure('development', function () {
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function () {

});

// this is how you provide vars to jade views
app.locals.settings = settings;
app.locals.app = app;
app.locals.firebase = firebase;

app.get('/', routes.index);
app.get('/enc/:s/:k', encDec.enc);
app.get('/dec/:s/:k', encDec.dec);

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});

pos.init();