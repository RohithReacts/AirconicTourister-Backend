const express = require("express");
const {
  getAllProducts,
  updateProduct,
  deleteProduct,
  createProduct,
} = require("../controllers/productController");

const router = express.Router();

router.post("/create", createProduct);
router.get("/", getAllProducts);
router.put("/update/:id", updateProduct);
router.delete("/delete/:id", deleteProduct);

module.exports = router;
