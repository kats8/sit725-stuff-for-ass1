var express = require("express"),
    app = express();

var port = process.env.PORT || 8080;

var nodemailer = require('nodemailer');


var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'SIT725.heartbreakers@gmail.com',
    pass: 'sit725hb'
  }
});

const sendMatchMail = (message) => {
var mailOptions = {
from: 'SIT725.heartbreakers@gmail.com',
to: 'SIT725.heartbreakers@gmail.com',
subject: 'Sending Email using Node.js',
text: message
};

transporter.sendMail(mailOptions, function(error, info){
if (error) {
  console.log(error);
} else {
  console.log('Email sent: ' + info.response);
}
}); 
}

app.use(express.static(__dirname + '/public'));

app.get("/test", function (request, response) {
  var user_name = request.query.user_name;
  response.end("Hello " + user_name + "!");
});

app.listen(port);
console.log("Listening on port ", port);

require("cf-deployment-tracker-client").track();
