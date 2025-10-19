const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  image: String,
  category: String,
  stock: { type: Number, default: 0 },

  // ✅ Cho phép nhiều tùy chọn khối lượng
  weights: {
    type: [Number],
    default: [2, 5, 10],
    validate: {
      validator: function (arr) {
        // Chỉ chấp nhận mảng có ít nhất 1 phần tử và toàn số dương
        return Array.isArray(arr) && arr.length > 0 && arr.every((w) => w > 0);
      },
      message: "Danh sách khối lượng phải là các số dương.",
    },
  },
});

module.exports = mongoose.model("Product", productSchema);
