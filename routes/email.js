var email = require('../models/emailNode.js');

exports.sendEmail = function(req, res) {
	email.sendEmail(JSON.parse(req.params.data));
	console.log("email");
};
