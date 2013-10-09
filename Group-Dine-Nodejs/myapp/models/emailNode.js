var email   = require("../node_modules/emailjs/email");

function sendEmail(jsonobj)
{
console.log(jsonobj.From);
var server  = email.server.connect({
   user:    jsonobj.From, 
   password: jsonobj.Password, 
   host:    jsonobj.SMTP, 
   ssl:     true

});

// send the message and get a callback with an error or details of the message that was sent
server.send({
   text:    jsonobj.Content, 
   from:    jsonobj.From, 
   to:      jsonobj.To,
   cc:      jsonobj.cc,
   subject: jsonobj.Subject
}, function(err, message) { console.log(err || message); });
}

exports.sendEmail=sendEmail;