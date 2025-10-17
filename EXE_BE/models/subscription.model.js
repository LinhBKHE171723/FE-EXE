const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    rice: { type: String, required: true },
    weight: { type: String, required: true },
    frequency: { type: String, required: true }, // weekly, biweekly, monthly
    startDate: { type: String, required: true },
    note: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subscription", subscriptionSchema);
