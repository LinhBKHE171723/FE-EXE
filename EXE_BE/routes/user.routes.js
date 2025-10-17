const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");
router.post("/register", userCtrl.register);
router.post("/login", userCtrl.login);
router.get(
  "/",
  authMiddleware.verifyToken,
  authMiddleware.isAdmin,
  userCtrl.getAllUsers
);
module.exports = router;
