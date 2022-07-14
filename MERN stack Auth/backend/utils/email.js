const nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
const verifyEmailTemplate = (link) =>
  `<>
    <h1>This Email is from "ABC Company"</h1>
    <h2>"Please click on below link to verify your email"</h2>
    <a target={"_blank"} href=${link}>${link}</a>
  </>`;

const resetPasswordEmailTemplate = (link) =>
  `<>
      <h1>This Email is from "ABC Company"</h1>
      <h2>"Please click on below link to reset your password"</h2>
      <a target={"_blank"} href=${link}>${link}</a>
    </>`;

module.exports = {
  transporter,
  verifyEmailTemplate,
  resetPasswordEmailTemplate,
};
