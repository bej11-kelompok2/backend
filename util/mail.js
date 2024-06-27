const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "bej11platinum2@gmail.com",
    pass: process.env.PASS_EMAIL,
  },
});

const sendEmail = (mail) => {
  return transporter.sendMail(mail, (err, info) => {
    if (err) {
      logger.error(error);
    } else {
      console.log("Email sent : " + info.response);
    }
  });
};

module.exports = {
  sendEmail,
};
