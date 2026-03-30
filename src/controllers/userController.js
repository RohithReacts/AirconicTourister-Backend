const User = require("../models/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { sendEmail } = require("../utils/emailService");

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const forgotPassword = async (req, res) => {
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

// @desc    Update user profile (name, avatar)
// @route   PUT /api/user/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const user = await User.findById(req.user.id);

    if (user) {
      user.name = name || user.name;
      user.avatar = avatar || user.avatar;

      const updatedUser = await user.save();

      res.json({
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        role: updatedUser.role,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @desc    Update user password
// @route   PUT /api/user/password
// @access  Private
const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (user) {
      const isMatch = await bcrypt.compare(oldPassword, user.password);

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid old password" });
      }

      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();

      res.json({ message: "Password updated successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @desc    Deactivate account (soft delete)
// @route   DELETE /api/user/deactivate
// @access  Private
const deactivateAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.isActive = false;
      await user.save();
      res.json({ message: "Account deactivated successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @desc    Get total user count
// @route   GET /api/user/count
// @access  Private/Admin
const getUserCount = async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @desc    Add a new address
// @route   POST /api/user/address
// @access  Private
const addAddress = async (req, res) => {
  try {
    const { firstName, lastName, address, city, state, zipCode, label } =
      req.body;

    if (!firstName || !lastName || !address || !city || !state || !zipCode) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.addresses.push({
      firstName,
      lastName,
      address,
      city,
      state,
      zipCode,
      label: label || "Home",
    });

    await user.save();
    res.status(201).json(user.addresses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @desc    Get all saved addresses
// @route   GET /api/user/address
// @access  Private
const getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("addresses");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user.addresses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @desc    Delete a saved address
// @route   DELETE /api/user/address/:addressId
// @access  Private
const deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.addresses = user.addresses.filter(
      (addr) => addr._id.toString() !== req.params.addressId,
    );

    await user.save();
    res.json(user.addresses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updatePassword,
  deactivateAccount,
  getUserCount,
  forgotPassword,
  addAddress,
  getAddresses,
  deleteAddress,
};
