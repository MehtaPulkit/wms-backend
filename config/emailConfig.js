const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: 'vivien.halvorson@ethereal.email',
    pass: 'kDx6VzAZQnmuRyV9CB'
  },
});
module.exports = transporter;
