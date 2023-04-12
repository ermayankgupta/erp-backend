const express = require("express");
const authController = require("../controller/authController");
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post("/login", authController.login);
router.post("/changepassword", authMiddleware, authController.changePassword);
router.get("/refreshtoken", authController.refreshToken);

module.exports = router;
  