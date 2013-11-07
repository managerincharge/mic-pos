module.exports = function (firebase, helper) {

	var fs = require('fs');

	var thisPosRef = firebase.thisPosRef;
	var newTransRef = thisPosRef.child('newTrans');
	var lastUploadInfoRef = thisPosRef.child('lastUploadInfo');
	var lastUploadInfo;
	var logger = firebase.logger;
	var config;
	var journalFile;
	var ctime, mtime, start;

	pos = {};

	pos.init = function() {
		thisPosRef.child('config/public').once('value', function (snap) {
			config = snap.val();
			journalFile = config.journalFilePath;
			lastUploadInfoRef.once('value', function (snap) {
				lastUploadInfo = snap.val();
				if (lastUploadInfo === null) { resetLastUploadInfo(); }
				// handle case where journal has changed since startup
				fs.stat(journalFile, function (err, stats) {
					if (err) {
						// file does not exist
						resetLastUploadInfo ();
					}
					else {
						ctime = helper.DateToStringSeqWithTimeIncSecs(stats.ctime);
						mtime = helper.DateToStringSeqWithTimeIncSecs(stats.mtime);
						start = -1;
						if (ctime != lastUploadInfo.fileCreated) {
							start = 0;
						} else if (stats.size > lastUploadInfo.uploadedSoFar) {
							start = lastUploadInfo.uploadedSoFar;
						}
						if (start > -1) {
							lastUploadInfo.fileCreated = ctime;
							lastUploadInfo.fileModified = mtime;
							lastUploadInfo.uploadedSoFar = parseInt(stats.size);
							readAndUpload(start);
						}
					}
					// start watching journal file
					fs.watchFile(journalFile, { interval: 2007 }, function(curr, prev) {
						if (curr.nlink === 0) {
							// no file
							resetLastUploadInfo ();
						} else {
							ctime = helper.DateToStringSeqWithTimeIncSecs(curr.ctime);
							mtime = helper.DateToStringSeqWithTimeIncSecs(curr.mtime);
							start = -1;
							if (ctime != lastUploadInfo.fileCreated) {
								start = 0;
							} else if (curr.size > lastUploadInfo.uploadedSoFar) {
								start = lastUploadInfo.uploadedSoFar;
							}
							if (start > -1) {
								lastUploadInfo.fileCreated = ctime;
								lastUploadInfo.fileModified = mtime;
								lastUploadInfo.uploadedSoFar = parseInt(curr.size);
								readAndUpload(start);
							}
						}
					});
				});
			});
		});
	};

	//
	// internal functions
	//
	function readAndUpload(startPos) {
		var rs = fs.createReadStream(journalFile, 
		{
			flags: 'r',
			encoding: 'utf8',
			autoClose: true,
			start: startPos,
		});
		var newText = '';
		rs.on('error', function (err) { logger.log(logger.ERROR, 'Error processing journal ' + journalFile + '\n' + err); });
		rs.on('end', function () {
			if (newText.length) {
				newTransRef.child(helper.DateToStringSeqWithTimeIncSecs(firebase.getEstServerTime())).set({text: newText});
			}
			lastUploadInfoRef.set(lastUploadInfo);
		});
		rs.on('data', function (d) { newText += d; });
	}

	function resetLastUploadInfo () {
		lastUploadInfo = {
			fileCreated: '',
			fileModified: '',
			uploadedSoFar: 0
		};
		lastUploadInfoRef.set(lastUploadInfo);
	}

	return pos;
};