module.exports = function (settings, helper, util) {

	var fb = {};
	var Firebase = require('firebase');
	var FirebaseTokenGenerator = require('firebase-token-generator');

	var tokenGenerator = new FirebaseTokenGenerator(helper.vernam.dec(settings.firebaseKey, settings.storeId));
	var token = tokenGenerator.createToken(
		// my data
		{
			org: helper.orgId,
			store: helper.storeId
		},
		// token options
		{
			debug: settings.firebaseSecurityDebug,
			expires: new Date(100000000*86400000)
		});

	fb.rootRef = new Firebase(settings.fbRootRef);
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
			logRef.child(helper.DateToStringSeqWithTimeIncSecs(getEstServerTime())).set(util.format('%s: %s', category, message));
		},
		// category can be any text, but the following constants are provided:
		ERROR: 'ERROR',
		INFO: 'INFO'
	};

	fb.rootRef.auth(token, function (error, result) {
		if(error) {
			console.log(util.format('Authentication to %s failed'));
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
