const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/auth");

// Protected Route - Update own profile (applicant/recruiter/admin)
router.put("/update-profile", authMiddleware, userController.updateProfile);

module.exports = router;