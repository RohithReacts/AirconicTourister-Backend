const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateProfile,
  updatePassword,
  deactivateAccount,
  getUserCount,
  forgotPassword,
  getAddresses,
  addAddress,
  deleteAddress,
} = require("../controllers/userController");
const { protect, admin } = require("../middleware/authMiddleware");

// Protected routes
router.get("/profile", protect, getProfile);
router.get("/count", protect, admin, getUserCount);
router.put("/profile", protect, updateProfile);
router.put("/password", protect, updatePassword);
router.delete("/deactivate", protect, deactivateAccount);
router.post("/forgot-password", forgotPassword);

// Address routes
router.get("/address", protect, getAddresses);
router.post("/address", protect, addAddress);
router.delete("/address/:addressId", protect, deleteAddress);

module.exports = router;
