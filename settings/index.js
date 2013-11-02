module.exports = function (app) {
	
	var env = app.get('env');
	var settings = require('./settings.' + env);

	return settings;

};
