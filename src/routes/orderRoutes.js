const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createOrder,
  getAllOrders,
  getUserOrders,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/orderController");

// Create a new order
router.post("/", createOrder);

// Get logged-in user's orders
router.get("/myorders", protect, getUserOrders);

// Get all orders
router.get("/", getAllOrders);

// Update order status
router.put("/:id/status", updateOrderStatus);

// Delete order
router.delete("/:id", deleteOrder);

module.exports = router;
