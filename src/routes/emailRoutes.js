const express = require("express");
const router = express.Router();
const { sendEmail } = require("../utils/emailService");

// Test email route
router.post("/send-test", async (req, res) => {
  const { to, subject, message } = req.body;

  if (!to || !subject || !message) {
    return res
      .status(400)
      .json({ error: "Please provide 'to', 'subject', and 'message'" });
  }

  try {
    await sendEmail({
      to,
      subject,
      text: message,
      html: `<p>${message}</p>`,
    });

    res
      .status(200)
      .json({ success: true, message: "Test email sent successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        error: "Failed to send email",
        details: error.message,
      });
  }
});

module.exports = router;
