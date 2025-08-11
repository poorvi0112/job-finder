const Application = require("../models/Application");

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

    // Optional: Check if user already applied to this job
    const alreadyApplied = await Application.findOne({
      jobId,
      userId: req.user._id,
    });

    if (alreadyApplied) {
      return res.status(400).json({ error: "You have already applied to this job" });
    }

    const application = new Application({
      jobId,
      userId: req.user._idid,
      resume: resumeUrl,
      status: "Applied", // default status
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
    const applications = await Application.find({ userId: req.user })
      .populate("jobId", "title company status") // include status here
      .sort({ createdAt: -1 });

    const formattedApplications = applications.map(app => ({
      id: app._id,
      status: app.status, // status of the application (e.g., "Pending", "Selected", "Rejected")
      appliedAt: app.appliedAt,
      resumeUrl: app.resume,
      job: {
        id: app.job._id,
        title: app.job.title,
        company: app.job.company,
        jobStatus: app.job.status // "Open", "Closed"
      }
    }));

    res.status(200).json(formattedApplications);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch applications" });
  }
};

exports.getApplicantsByJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const applications = await Application.find({ jobId })
      .populate("userId", "name email") // populate applicant details
      .sort({ createdAt: -1 });

    const formattedApplicants = applications.map(app => ({
      _id: app._id,
      applicant: {
        name: app.userId.name,
        email: app.userId.email,
      },
      resume: app.resume,
      status: app.status,
      appliedAt: app.createdAt,
    }));

    res.status(200).json(formattedApplicants);
  } catch { console.error("Apply error:", err);
           res.status(500).json({ error: err.message, stack: err.stack });
    }
};


