const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateProfile,
  updatePassword,
  deactivateAccount,
  getUserCount,
} = require("../controllers/userController");
const { protect, admin } = require("../middleware/authMiddleware");

// Protected routes
router.get("/profile", protect, getProfile);
router.get("/count", protect, admin, getUserCount);
router.put("/profile", protect, updateProfile);
router.put("/password", protect, updatePassword);
router.delete("/deactivate", protect, deactivateAccount);

module.exports = router;
