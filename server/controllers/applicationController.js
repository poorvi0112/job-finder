const Application = require("../models/Application");

// Apply to a job
exports.applyToJob = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "Resume is required" });
    }

    const resumeUrl = `/uploads/resumes/${file.filename}`;
    const { jobId } = req.params;

    if (!jobId) {
      return res.status(400).json({ error: "Job ID is required" });
    }

    // Check if already applied
    const alreadyApplied = await Application.findOne({
      job: jobId,
      applicant: req.user._id,
    });

    if (alreadyApplied) {
      return res.status(400).json({ error: "You have already applied to this job" });
    }

    const application = new Application({
      job: jobId,
      applicant: req.user._id,
      resume: resumeUrl,
      status: "pending", // ✅ matches schema enum
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
      .populate("job", "title company status")
      .sort({ createdAt: -1 });

    const formattedApplications = applications.map(app => ({
      id: app._id,
      status: app.status,
      appliedAt: app.appliedAt,
      resumeUrl: app.resume,
      job: {
        id: app.job._id,
        title: app.job.title,
        company: app.job.company,
        jobStatus: app.job.status,
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
        name: app.applicant.name,
        email: app.applicant.email,
      },
      resume: app.resume,
      status: app.status,
      appliedAt: app.createdAt,
    }));

    res.status(200).json(formattedApplicants);
  } catch (err) {
    console.error("Error fetching applicants:", err);
    res.status(500).json({ error: err.message, stack: err.stack });
  }
};
