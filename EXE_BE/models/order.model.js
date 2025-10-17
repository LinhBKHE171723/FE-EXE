const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    paymentMethod: { type: String, enum: ["cod", "bank"], default: "cod" },
    status: {
      type: String,
      enum: ["pending", "waiting_payment", "paid", "shipped", "completed"],
      default: "pending",
    },
    totalPrice: { type: Number, required: true },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
        weight: { type: Number, enum: [2, 5, 10], required: true }, // 👈 thêm dòng này
        price: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
