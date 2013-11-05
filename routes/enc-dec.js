
/*
 * GET users listing.
 */

 module.exports = function (helper) {
 	return {

 		enc: function(req, res){
 			var s = req.params.s;
 			var k = req.params.k;
 			var result = helper.vernam.enc(s, k);
 			result = helper.encBase64(result);
 			res.send(result);
 		},

 		dec: function(req, res){
 			var s = req.params.s;
 			var k = req.params.k;
 			s = helper.decBase64(s);
 			var result = helper.vernam.dec(s, k);
 			res.send(result); 		}

 	};
 };