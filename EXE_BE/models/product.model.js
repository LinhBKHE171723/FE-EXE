const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  image: String,
  category: String,
  stock: { type: Number, default: 0 },
  // 3 đơn vị bán mặc định
  weights: {
    type: [Number],
    default: [2, 5, 10],
    immutable: true,
  },
});

module.exports = mongoose.model("Product", productSchema);
