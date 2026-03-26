const Order = require("../models/Order");

// Create a new order
const createOrder = async (req, res) => {
  try {
    const { customerDetails, orderItems, totalAmount } = req.body;

    if (
      !customerDetails ||
      !orderItems ||
      orderItems.length === 0 ||
      !totalAmount
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newOrder = new Order({
      customerDetails,
      orderItems,
      totalAmount,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Server error creating order" });
  }
};

// Get all orders (for Admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error fetching orders" });
  }
};

// Get user orders
const getUserOrders = async (req, res) => {
  try {
    const userEmail = req.user.email;
    const escapedEmail = userEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const orders = await Order.find({
      "customerDetails.email": { $regex: new RegExp(`^${escapedEmail}$`, "i") },
    }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Server error fetching user orders" });
  }
};

// Update order status (for Admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["Processing", "Shipped", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Server error updating order status" });
  }
};

// Delete order (for Admin)
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Server error deleting order" });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getUserOrders,
  updateOrderStatus,
  deleteOrder,
};
