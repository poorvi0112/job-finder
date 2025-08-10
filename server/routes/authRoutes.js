const express = require("express");
const router = express.Router();
const { register, login, getUserProfile } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, getUserProfile);

module.exports = router;
