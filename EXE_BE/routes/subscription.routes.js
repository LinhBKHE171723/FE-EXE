const express = require("express");
const router = express.Router();
const {
  createSubscription,
  getAllSubscriptions,
} = require("../controllers/subscription.controller");

// 🧩 Route đăng ký
router.post("/", createSubscription);

// 🧩 Route lấy toàn bộ danh sách (cho admin)
router.get("/", getAllSubscriptions);

module.exports = router;
