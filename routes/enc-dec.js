
/*
 * GET users listing.
 */

 module.exports = function (helper) {
 	return {

 		enc: function(req, res){
 			var s = req.params.s;
 			res.send(helper.vernam.enc(s, helper.settings.storeId) + '<br>' + helper.settings.storeId + '<br>' + s);
 		},

 		dec: function(req, res){
 			var s = req.params.s;
 			res.send(helper.vernam.dec(s, helper.settings.storeId) + '<br>' + helper.settings.storeId + '<br>' + s);
 		}

 	};
 };