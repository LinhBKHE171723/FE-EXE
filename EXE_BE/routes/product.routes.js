const express = require("express");
const router = express.Router();
const productCtrl = require("../controllers/product.controller");
const Product = require("../models/product.model");

router.get("/", productCtrl.getAll);
router.post("/", productCtrl.create);
router.put("/:id", productCtrl.update);
router.delete("/:id", productCtrl.delete);

module.exports = router;
