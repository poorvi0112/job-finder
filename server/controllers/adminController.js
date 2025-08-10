const User = require("../models/User");
const Job = require("../models/Job");

// Admin: Get all recruiters and their job postings
exports.getRecruitersWithJobs = async (req, res) => {
  try {
    // Get all recruiters
    const recruiters = await User.find({ role: "recruiter" }).select("username email company");

    // Fetch jobs posted by each recruiter
    const recruiterData = await Promise.all(
      recruiters.map(async (recruiter) => {
        const jobs = await Job.find({ recruiterId: recruiter._id }).select("title role location salaryRange");
        return {
          recruiterId: recruiter._id,
          name: recruiter.username,
          email: recruiter.email,
          company: recruiter.company,
          totalJobsPosted: jobs.length,
          jobs
        };
      })
    );

    res.json({ recruiterData });
  } catch (err) {
    console.error("Admin recruiter fetch error", err);
    res.status(500).json({ error: "Failed to fetch recruiter data" });
  }
};

// Admin: Get overall stats for dashboard
exports.getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "applicant" });
    const totalRecruiters = await User.countDocuments({ role: "recruiter" });
    const totalJobs = await Job.countDocuments();

    res.json({
      totalUsers,
      totalRecruiters,
      totalJobs
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to get admin stats" });
  }
};
