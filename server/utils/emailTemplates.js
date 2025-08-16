const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


exports.sendAcceptedEmail = async (to, name) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Application Accepted 🎉",
    text: `Hello ${name},\n\nCongratulations! Your application has been accepted.\n\n Our Team will Contact with you regarding further process soon.\n\n Best regards,\nJobifyHub Team`
  });
};


exports.sendRejectedEmail = async (to, name) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Application Update",
    text: `Hello ${name},\n\nWe regret to inform you that your application has been rejected.\n\nBest regards,\nJobifyHub Team`
  });
};
