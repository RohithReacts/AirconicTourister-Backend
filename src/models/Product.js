const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    pricemrp: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
    },
    image2: {
      type: String,
    },
    image3: {
      type: String,
    },
    image4: {
      type: String,
    },
    image5: {
      type: String,
    },
    image6: {
      type: String,
    },
    category: {
      type: String,
    },
    brand: {
      type: String,
    },
    size: {
      type: String,
    },
    color: {
      type: String,
    },
    stock: {
      type: Number,
      default: 0,
    },
    salePrice: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", productSchema);
