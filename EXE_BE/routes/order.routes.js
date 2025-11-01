const express = require("express");
const router = express.Router();
const orderCtrl = require("../controllers/order.controller");

router.post("/", orderCtrl.createOrder);
router.get("/user/:userId", orderCtrl.getUserOrders);
router.get("/", orderCtrl.getAllOrders);

router.patch("/:id/status", orderCtrl.updateStatus);
router.patch("/:id", orderCtrl.updateOrder);
router.delete("/:id", orderCtrl.deleteOrder);

module.exports = router;
