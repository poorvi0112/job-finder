const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobController");
const authMiddleware = require("../middleware/auth");
const isRecruiter = require("../middleware/isRecruiter");

// Public Routes
router.get("/", jobController.getAllJobs);
router.get("/:id", jobController.getJobById);

// Protected Routes (Only Recruiters can manage jobs)
router.post("/", authMiddleware, isRecruiter, jobController.createJob);
router.put("/:id", authMiddleware, isRecruiter, jobController.updateJob);
router.delete("/:id", authMiddleware, isRecruiter, jobController.deleteJob);


module.exports = router;