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
  to: '',
  subject: 'You have a new match!',
  text: ''
};


app.use(express.static(__dirname + '/public'));


app.post('/sendMessage', (req, res) => {
  console.log(req.body);
 message = String(req.body.message);
 to = String(req.body.toAddress)
 sendHeartbreakerMail(message, to)
 res.send({result:200});
})

const sendHeartbreakerMail = (message, to) => {
  mailOptions.text = message;
  mailOptions.to = to;

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
