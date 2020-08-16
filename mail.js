

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
  subject: 'Sending Email using Node.js',
  text: ''
};
/*
app.get("/test", function (request, response) {
  var user_name = request.query.user_name;
  response.end("Hello " + user_name + "!");
});
*/
const sendHeartbreakerEmail = (message) => {
  mailOptions.text = message;
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}
