
/*
 * GET users listing.
 */
 var helper = require('../app/helper');

 module.exports = function (settings) {
 	return {

 		enc: function(req, res){
 			var s = req.params.s;
 			res.send(helper.vernam.enc(s, settings.storeId));
 		},

 		dec: function(req, res){
 			var s = req.params.s;
 			res.send(helper.vernam.dec(s, settings.storeId));
 		}

 	};
 };