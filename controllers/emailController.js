// emailController.js

// const nodemailer = require("nodemailer");

// // Configure transporter (as shown previously)
// const transporter = nodemailer.createTransport({
//     host: "smtp.ethereal.email",
//     port: 587,
//     secure: false, // Use `true` for port 465, `false` for all other ports
//     auth: {
//         user: 'vivien.halvorson@ethereal.email',
//         pass: 'kDx6VzAZQnmuRyV9CB'
//     },
//   });

const transporter = require("../config/emailConfig");
// Function to send email
const sendEmail = async (req, res) => {
  const emailDataArray = req.body;
  try {
    for (const emailData of emailDataArray) {
      const { from, to, subject, html } = emailData;

      // Send email to each recipient
      await transporter.sendMail({
        from,
        to,
        subject,
        html,
      });
    }
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res
      .status(500)
      .json({ message: "Failed to send email. Please try again later." });
  }
};

module.exports = { sendEmail };
