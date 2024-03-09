// emailService.js

const nodemailer = require('nodemailer');

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,

  auth: {
    user: 'ankit.21ug1003@gmail.com',
    pass: 'ztxpmwtblugxcmgy'
  }
});

// Function to send email
const sendEmail = async (to, subject, text) => {
  try {


    // Send mail with defined transport object
    let info = await transporter.sendMail({
      from: 'ankit.21ug1003@gmail.com',
      to: to,
      subject: subject,
      text: text,
    });
    console.log('mail success===============================================>', info.response)
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = { sendEmail };
