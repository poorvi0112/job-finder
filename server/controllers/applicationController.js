const Application = require("../models/Application");
const { sendAcceptedEmail, sendRejectedEmail } = require("../utils/emailTemplates");
const path = require("path");
const fs = require("fs");

// Apply to a job
exports.applyToJob = async (req, res) => {
  try {
     const { jobId } = req.params;
    if (!jobId) return res.status(400).json({ error: "Job ID is required" });

    // 🔹 Check duplicate BEFORE using resume
    const alreadyApplied = await Application.findOne({
      job: jobId,
      applicant: req.user._id,
    });
    
    if (alreadyApplied) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ error: "You have already applied to this job" });
    }

    const file = req.file;
     if(!file) return res.status(400).json({ error: "Resume is required" });
    
    // ✅ Ensure HTTPS on Render
    const protocol = req.headers["x-forwarded-proto"] || req.protocol;
    const resumeUrl = `${protocol}://${req.get("host")}/uploads/resumes/${file.filename}`;

    const application = new Application({
      job: jobId,
      applicant: req.user._id,
      resume: resumeUrl,
      status: "pending",
    });

    await application.save();
    res.status(201).json({ message: "Application submitted", application });
  } catch (err) {
    console.error("Apply error:", err);
    res.status(500).json({ error: "Failed to apply" });
  }
};

// Applicant views their own applications
exports.getApplicationsByUser = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate({
        path: "job",
        select: "title status recruiterId",
        populate: {
          path: "recruiterId",
          select: "company name email", // assuming company field exists in User model
        },
      })
      .sort({ createdAt: -1 });

    const formattedApplications = applications.map(app => ({
      _id: app._id,
      status: app.status,
      appliedAt: app.createdAt, 
      resumeUrl: app.resume,
      job: {
        id: app.job?._id,
        title: app.job?.title,
        company: app.job?.recruiterId?.company || "N/A",
        jobStatus: app.job?.status,
      },
    }));

    res.status(200).json(formattedApplications);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch applications" });
  }
};

// Recruiter views all applicants for a job
exports.getApplicantsByJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const applications = await Application.find({ job: jobId })
      .populate("applicant", "name email")
      .sort({ createdAt: -1 });

    const formattedApplicants = applications.map(app => ({
      _id: app._id,
      applicant: {
        name: app.applicant?.name,
        email: app.applicant?.email,
      },
      resume: app.resume,
      status: app.status,
      appliedAt: app.createdAt,
    }));

    res.status(200).json(formattedApplicants);
  } catch (err) {
    console.error("Error fetching applicants:", err);
    res.status(500).json({ error: err.message });
  }
};
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const application = await Application.findById(id).populate("applicant");
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    application.status = status;
    await application.save();

    
    if (status === "accepted") {
      await sendAcceptedEmail(application.applicant.email, application.applicant.name);
    } else if (status === "rejected") {
      await sendRejectedEmail(application.applicant.email, application.applicant.name);
    }

    res.json({ message: `Application ${status} successfully`, application });
  } catch (err) {
    console.error("Error updating status", err);
    res.status(500).json({ error: "Server error" });
  }
};
