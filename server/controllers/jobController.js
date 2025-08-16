const Job = require("../models/Job");

// @desc    Create a new job (Recruiter only)
exports.createJob = async (req, res) => {
  try {
    const { title, description, location, salaryRange, status } = req.body;
    const recruiterId = req.user._id;

    const newJob = new Job({
      title,
      description,
      location,
      salaryRange,
      status: status || "Open", // default to "Open"
      recruiterId
    });

    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (err) {
    res.status(500).json({ error: "Failed to create job" });
  }
};

// @desc    Get all jobs (Public)
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({}, "title location salaryRange status createdAt")
      .populate("recruiterId", "company username");

    const formattedJobs = jobs.map(job => ({
      id: job._id,
      title: job.title,
      location: job.location,
      salaryRange: job.salaryRange,
      status: job.status,
      postedAt: job.createdAt,
      company: job.recruiterId?.company || "N/A",
      recruiter: job.recruiterId?.username || "N/A"
    }));

    res.status(200).json(formattedJobs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
};

// @desc    Get job by ID (Public)
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("recruiterId", "company username email");

    if (!job) return res.status(404).json({ error: "Job not found" });

    const formattedJob = {
      id: job._id,
      title: job.title,
      description: job.description,
      location: job.location,
      salaryRange: job.salaryRange,
      status: job.status,
      postedAt: job.createdAt,
      updatedAt: job.updatedAt,
      company: job.recruiterId?.company || "N/A",
      recruiter: {
        name: job.recruiterId?.username || "N/A",
        email: job.recruiterId?.email || "N/A"
      }
    };

    res.status(200).json(formattedJob);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch job" });
  }
};

// @desc    Update job (Recruiter only)
exports.updateJob = async (req, res) => {
  
  try {
    const job = await Job.findById(req.params.id);

    if (!job) return res.status(404).json({ error: "Job not found" });
    if (job.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized to update this job" });
    }

    const { title, description, location, salaryRange, status } = req.body;

    job.title = title || job.title;
    job.description = description || job.description;
    job.location = location || job.location;
    job.salaryRange = salaryRange || job.salaryRange;
    job.status = status || job.status;

    const updatedJob = await job.save();
    res.status(200).json(updatedJob);
  } catch (err) {
    res.status(500).json({ error: "Failed to update job" });
    
  }
};

// @desc    Delete job (Recruiter only)
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) return res.status(404).json({ error: "Job not found" });

    if (job.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized to delete this job" });
    }

    await job.deleteOne();
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete job" });
  }
};
