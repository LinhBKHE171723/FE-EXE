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
      enum: ["pending", "confirmed", "shipped", "completed", "cancelled"],
      default: "pending",
      index: true,
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
        // ✅ Cho phép khối lượng bất kỳ trong khoảng 1–100 kg
        weight: {
          type: Number,
          required: true,
          min: [1, "Khối lượng tối thiểu là 1 kg"],
          max: [100, "Khối lượng tối đa là 100 kg"],
          validate: {
            validator: (v) => v >= 1 && v <= 100,
            message: "Khối lượng phải nằm trong khoảng từ 1 đến 100 kg",
          },
        },
        price: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
