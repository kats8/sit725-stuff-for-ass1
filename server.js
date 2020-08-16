const bodyParser = require('body-parser');
var express = require("express"),
  app = express();

var port = process.env.PORT || 8080;

app.use(bodyParser.json());

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'SIT725.heartbreakers@gmail.com',
    pass: 'sit725hb'
  }
});

var mailOptions = {
  from: 'SIT725.heartbreakers@gmail.com',
  to: 'SIT725.heartbreakers@gmail.com',
  subject: 'You have a new match!',
  text: ''
};


app.use(express.static(__dirname + '/public'));

//GET RID OF THIS LATER
app.get("/test", function (request, response) {
  var user_name = request.query.user_name;
  response.end("Hello " + user_name + "!");
});

app.get("/post", function (request, response) {
  var user_name = request.query.user_name;
  response.end("Hello " + user_name + "!");
});

app.post('/sendMessage', (req, res) => {
  console.log(req.body);
 message = String(req.body.message);
 sendHeartbreakerMail(message, res)
})

const sendHeartbreakerMail = (message) => {
  mailOptions.text = message;
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

app.listen(port);
console.log("Listening on port ", port);

require("cf-deployment-tracker-client").track();
