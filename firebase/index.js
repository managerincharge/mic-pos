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
	fb.rootRef.auth(token, function (error, result) {
		if(error) {
			console.log('Login FAILED to Firebase: ' + settings.fbRootRef);
		} else {
			console.log('Logged in to Firebase: ' + settings.fbRootRef);
		};
	});

	fb.thisPosRef = fb.rootRef.child(util.format('org/%s/store/%s', helper.orgId, helper.storeId));
	fb.connectedRef = fb.rootRef.child('.info/connected');

	fb.connectedRef.on('value', function (snap) {
		if (snap.val() === true) {
			fb.thisPosRef.child('lastOnline').set(true);
			fb.thisPosRef.child('lastOnline').onDisconnect().set(Date(Firebase.ServerValue.TIMESTAMP));
		};
	});

	return {
		Firebase: Firebase,
		rootRef: fb.rootRef,
		thisPosRef: fb.thisPosRef,
		connectedRef: fb.connectedRef
	};

};

// internal functions
