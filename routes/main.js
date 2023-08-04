const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const { ensureAuth } = require("../middleware/auth");

// LOGIN
router.post("/login", authController.login);

// SIGN UP
router.post("/register", authController.register);

module.exports = router;
