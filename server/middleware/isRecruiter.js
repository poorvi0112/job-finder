const isRecruiter = (req, res, next) => {
  if (req.user && req.user.role === "recruiter") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied: Recruiters only" });
  }
};

module.exports = isRecruiter;
