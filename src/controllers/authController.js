const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const transporter = require("../config/emailConfig");

const SignUpUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const SignInUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({
      message: "User signed in successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const SignOutUser = async (req, res) => {
  res.json({ message: "User signed out successfully" });
};

const emailVerification = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const verificationToken = crypto.randomBytes(20).toString("hex");
    user.verificationToken = verificationToken;
    user.verificationExpires = Date.now() + 3600000; // 1 hour
    await user.save();
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
    const { sendEmail } = require("../utils/emailService");
    await sendEmail({
      to: user.email,
      subject: "Email Verification",
      text: `You are receiving this because you (or someone else) have requested the verification of the email for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n
        ${verificationUrl}\n\n
        If you did not request this, please ignore this email and your email will remain unchanged.\n`,
      html: `<p>You are receiving this because you (or someone else) have requested the verification of the email for your account.</p>
        <p>Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:</p>
        <a href="${verificationUrl}">${verificationUrl}</a>
        <p>If you did not request this, please ignore this email and your email will remain unchanged.</p>`,
    });
    res.json({ message: "Email verification link sent to your email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};



const ForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const { sendEmail } = require("../utils/emailService");

    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n
        ${resetUrl}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      html: `<p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
        <p>Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`,
    });

    res.json({ message: "Password reset link sent to your email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const ResetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Password reset token is invalid or has expired" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = "";
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  SignUpUser,
  SignInUser,
  SignOutUser,
  ForgotPassword,
  ResetPassword,
  emailVerification,
};
