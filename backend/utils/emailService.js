const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  }
});

const sendEmail = async (to, subject, text) => {
  try {

    await transporter.sendMail({
      from: 'ankit.21ug1003@gmail.com',
      to: to,
      subject: subject,
      text: text,
    });


  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = { sendEmail };
