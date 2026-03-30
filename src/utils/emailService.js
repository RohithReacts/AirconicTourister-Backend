const transporter = require("../config/emailConfig");

/**
 * Send an email using the configured transporter.
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text content
 * @param {string} options.html - HTML content
 */
const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const mailOptions = {
      from:
        process.env.EMAIL_FROM ||
        '"Airconic Tourister" <noreply@airconictourister.com>',
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = {
  sendEmail,
};
