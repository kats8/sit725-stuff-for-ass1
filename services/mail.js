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
  text: 'Just checking!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
}); 