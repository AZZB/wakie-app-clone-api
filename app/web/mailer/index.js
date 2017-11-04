import { sendEmail, mailOptions } from './config';

require('dotenv').config();

export default function sendEmailVerificationLink(user, token) {
  const link = `${process.env.BASE_URL}/auth/verifyemail/${token}`;
  const subject = 'Email address verification';
  const text = `Hi ${user.profile.fullname || 'Wakie User'} `;
  const html = `
    <h3>Email verification</h3>
    <p>Thanks for registering to Wakie app, please verify your email by clicking on the verfication link below</p> <br/>
    <a href="${link}">Verfication link</a>
  `;

  const options = mailOptions('"Wakie-clone Team" <aikidocomba@hh.com>', user.credential.email, subject, text, html);
  sendEmail(options);
}
