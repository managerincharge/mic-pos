module.exports = function (firebase, helper) {

	var fs = require('fs');

	var thisPosRef = firebase.thisPosRef;
	var newTransRef = thisPosRef.child('newTrans');
	var logger = firebase.logger;
	var config;
	var journalFile;
	var fsWatch;

	pos = {};

	pos.init = function() {
		thisPosRef.child('config/public').once('value', function (snap) {
			config = snap.val();
			journalFile = config.journalFilePath;
			//  start watching journal file
			fsWatch = fs.watchFile(journalFile, function(curr, prev){

				console.log(curr);
				console.log(prev);

				if ( parseInt(curr.size) > parseInt(prev.size) ) {
					var rs = fs.createReadStream(journalFile, 
					{
						flags: 'r',
						encoding: 'utf8',
						autoClose: true,
						start: prev.size,
					});
					var newText = '';
					rs.on('error', function (err) { logger.log(logger.ERROR, 'Error processing journal ' + journalFile + '\n' + err); });
					rs.on('end', function () {
						newTransRef.child(helper.DateToStringSeqWithTimeIncSecs(firebase.getEstServerTime())).set({text: newText});
					});
					rs.on('data', function (d) { newText += d; });
				} else {
					logger.log(logger.INFO, 'Size of ' + journalFile + ' SHRANK from ' + prev.size + ' to ' + curr.size);
				}
				
			});
		});
	};








	return pos;
};