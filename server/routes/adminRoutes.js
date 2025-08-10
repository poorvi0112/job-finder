const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const isAdmin = require("../middlewares/isAdmin"); // ensure only admin can access

// Route to get all recruiters and their jobs
router.get("/recruiters", authMiddleware, isAdmin, adminController.getRecruitersWithJobs);

// Route to get overall admin stats
router.get("/stats", authMiddleware, isAdmin, adminController.getAdminStats);

module.exports = router;
