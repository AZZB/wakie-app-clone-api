import nodemailer from 'nodemailer';

require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  }
});


export const mailOptions = (from = '',to, subject, text, html) => ({
  from,
  to,
  subject,
  text,
  html,
});



export function sendEmail(options, cb) {
  transporter.sendMail(options, (error, info) => {
    if(error)  console.log('error email: ', error);
    console.log(`message ${info.messageId} sent: ${info.response}`);
    smtpTransport.close();
  });
}
