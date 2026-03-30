const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/signup", authController.SignUpUser);
router.post("/signin", authController.SignInUser);
router.post("/signout", authController.SignOutUser);
router.post("/forgot-password", authController.ForgotPassword);
router.post("/reset-password/:token", authController.ResetPassword);
router.post("/email-verification", authController.emailVerification);

module.exports = router;
