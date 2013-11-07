module.exports = function (helper) {

	var fb = {};
	var Firebase = require('firebase');
	var FirebaseTokenGenerator = require('firebase-token-generator');
	var util = helper.util;

	var tokenGenerator = new FirebaseTokenGenerator(helper.vernam.dec(helper.decBase64(helper.settings.firebaseKey), helper.settings.storeId));
	var token = tokenGenerator.createToken(
		// my data
		{
			org: helper.orgId,
			store: helper.storeId
		},
		// token options
		{
			debug: helper.settings.firebaseSecurityDebug,
			expires: new Date(100000000*86400000)
		});

	fb.rootRef = new Firebase(helper.settings.fbRootRef);
	fb.thisPosRef = fb.rootRef.child(util.format('org/%s/store/%s', helper.orgId, helper.storeId));
	var connectedRef = fb.rootRef.child('.info/connected');
	var logRef = fb.thisPosRef.child('log');
	var lastOnlineRef = fb.thisPosRef.child('lastOnline');

	var serverTimeOffsetMs;
	fb.rootRef.child('.info/serverTimeOffset').on('value', function (snap) {
		serverTimeOffsetMs = snap.val();
	});

	fb.logger = {
		log: function (category, message) {
			var entry = util.format('%s: %s', category, message);
			if (fb.online) {
				logRef.child(helper.DateToStringSeqWithTimeIncSecs(getEstServerTime())).set(entry);
			} else {
				helper.localLogger.log(helper.DateToStringSeqWithTimeIncSecs(getEstServerTime()) + ' - ' + entry);
			}
		},
		// category can be any text, but the following constants are provided:
		ERROR: 'ERROR',
		INFO: 'INFO'
	};

	fb.rootRef.auth(token, function (error, result) {
		if(error) {
			fb.logger.log(fb.logger.ERROR, util.format('Authentication to %s failed', fb.rootRef.toString()));
		}
	});

	connectedRef.on('value', function (snap) {
		if (snap.val() === true) {
			fb.online = true;
			lastOnlineRef.onDisconnect().set(Firebase.ServerValue.TIMESTAMP);
			lastOnlineRef.set(true);
			fb.logger.log(fb.logger.INFO, util.format('Connected to %s', fb.rootRef.toString()));
		} else {
			fb.online = false;
		}
	});

	function getEstServerTime () { return Date.now() + serverTimeOffsetMs; }

	return {
		Firebase: Firebase,
		logger: fb.logger,
		rootRef: fb.rootRef,
		thisPosRef: fb.thisPosRef,
		online: fb.online,
		getEstServerTime: getEstServerTime
	};

};
