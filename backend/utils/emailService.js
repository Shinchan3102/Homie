// emailService.js

const nodemailer = require('nodemailer');

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'ankitkumardos47@gmail.com',
    pass: 'your_password'
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    // Send mail with defined transport object
    let info = await transporter.sendMail({
      from: 'Ankit Kumar <ankitkumardos47@gmail.com>',
      to: to,
      subject: subject,
      text: text,
      html: html
    });

    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = { sendEmail };
