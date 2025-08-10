const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["applicant", "recruiter","admin"], 
      default: "applicant",
    },
    resume: {
      type: String, // for applicants
    },
    // Recruiter-specific fields
    company: String,
    designation: String,
    website: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
