const Job = require("../models/Job");
const Application = require("../models/Application");
const User = require("../models/User");

// ==========================
// Get all jobs posted by the current recruiter
// ==========================
exports.getMyJobs = async (req, res) => {
  try {
    // Fetch jobs posted by the recruiter and populate company & name
    const jobs = await Job.find({ recruiterId: req.user._id })
      .populate("recruiterId", "company name");

    // Add applicant count to each job
    const jobsWithCounts = await Promise.all(
      jobs.map(async (job) => {
        const applicantCount = await Application.countDocuments({ job: job._id });
        return {
          _id: job._id,
          title: job.title,
          location: job.location,
          salaryRange: job.salaryRange,
          status: job.status,
          company: job.recruiterId?.company || "N/A",
          recruiterName: job.recruiterId?.name || "N/A",
          applicantCount,
        };
      })
    );

    res.status(200).json(jobsWithCounts);
  } catch (err) {
    console.error("Error fetching recruiter jobs:", err);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
};

// ==========================
// Get all applications for the recruiter's jobs
// ==========================
exports.getApplicationsForMyJobs = async (req, res) => {
  try {
    // Get all jobs by this recruiter
    const jobs = await Job.find({ recruiterId: req.user._id }).select("_id");
    const jobIds = jobs.map((job) => job._id);

    // Find all applications for these jobs
    const applications = await Application.find({ job: { $in: jobIds } })
      .populate("applicant", "name email") // applicant info
      .populate("job", "title"); // job info

    res.status(200).json(applications);
  } catch (err) {
    console.error("Error fetching applications:", err);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
};

// ==========================
// Update status of a specific application
// ==========================
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    // Find application and populate job to access recruiterId
    const application = await Application.findById(applicationId).populate("job");

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    // Only the recruiter who posted the job can update the status
    if (application.job.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized to update this application" });
    }

    application.status = status;
    await application.save();

    res.status(200).json({ message: "Status updated successfully", application });
  } catch (err) {
    console.error("Error updating application status:", err);
    res.status(500).json({ error: "Failed to update status" });
  }
};
