const nodemailer = require('nodemailer');

// Create a "transporter" — this is the object that actually knows HOW to send emails
// using Gmail's SMTP servers with our credentials
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// This is a reusable function — any part of our app can call this
// to send an email to anyone, with any subject/message
const sendEmail = async (toEmail, subject, message) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER, // who the email appears to be from
    to: toEmail,                   // recipient's email
    subject: subject,              // email subject line
    text: message,                 // plain text body of the email
  });
};

module.exports = sendEmail;