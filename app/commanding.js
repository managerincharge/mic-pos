module.exports = function (firebase, helper) {

	cmdListRef = firebase.thisPosRef.child('commands/list');
	cmdResultsRef = firebase.thisPosRef.child('commands/results');

	// start watching for commands
	cmdListRef.on('child_added', newCmdHandler);

	return {

		commander: this

	};
	

	// internal functions

	function newCmdHandler (snap) {
		try {
			code = snap.val();
			result = eval(code);
			cmdResultsRef.child(snap.name()).set(result);
			cmdListRef.child(snap.name()).remove();
		} catch (e) {
			firebase.logger.log(firebase.logger.ERROR, 'Error in newCmdHandler of commanding.js: ' + e);
		}
	}

};

