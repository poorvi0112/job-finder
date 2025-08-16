const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/applicationController");
const authMiddleware = require("../middleware/auth");
const upload = require("../middleware/uploadMiddleware");
const isRecruiter = require("../middleware/isRecruiter");
// Apply to a job (applicant uploads resume)
router.post("/apply/:jobId", authMiddleware, upload.single("resume"), applicationController.applyToJob);

// Get logged-in user’s applications
router.get("/my-applications", authMiddleware, applicationController.getApplicationsByUser);

router.get("/job/:jobId", authMiddleware,isRecruiter, applicationController.getApplicantsByJob);
router.put("/update-status/:id",applicationController/updateApplicationStatus);
module.exports = router;