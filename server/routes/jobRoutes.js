const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobController");
const authMiddleware = require("../middleware/authMiddleware");
const isRecruiter = require("../middlewares/isRecruiter");

// Public Routes
router.get("/", jobController.getAllJobs);
router.get("/:id", jobController.getJobById);

// Protected Routes (Only Recruiters can manage jobs)
router.post("/", auth, isRecruiter, jobController.createJob);
router.put("/:id", auth, isRecruiter, jobController.updateJob);
router.delete("/:id", auth, isRecruiter, jobController.deleteJob);


module.exports = router;