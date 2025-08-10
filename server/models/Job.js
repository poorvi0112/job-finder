const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: String,
  description: String,
  location: String,
  salaryRange: String,
  status: {
    type: String,
    enum: ["Open", "Closed"],
    default: "Open"
  },
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true }); // adds createdAt and updatedAt

module.exports = mongoose.model("Job", jobSchema);
