const express = require("express");
const router = express.Router();
const recruiterController = require("../controllers/recruiterController");
const authMiddleware = require("../middleware/auth");
const isRecruiter = require("../middleware/isRecruiter");

// Get jobs posted by recruiter
router.get("/my-jobs", authMiddleware,isRecruiter, recruiterController.getMyJobs);

// Get all applications for recruiter's jobs
router.get("/my-applications", authMiddleware, isRecruiter, recruiterController.getApplicationsForMyJobs);

// Update application status (e.g., selected/rejected)
router.put("/application/:id/status", authMiddleware, isRecruiter, recruiterController.updateApplicationStatus);


module.exports = router;