module.exports = function (fb, utils, moment) {

	// Logs to mic-pos firebase

	var source = utils.orgId + '-' + utils.storeId;
	var logRef = fb.rootRef
		.child('org')
		.child(utils.orgId)
		.child('store')
		.child(utils.storeId)
		.child('log');

	return {
		log: function (category, message) {
			logRef.child(fb.Firebase.ServerValue.TIMESTAMP).set(
				{
					source: source,
					category: category,
					message: message
				}
			);
		},

		// category can be any text, but the following constants are provided:
		ERROR: 'ERROR',
		INFO: 'INFO'
	};

};