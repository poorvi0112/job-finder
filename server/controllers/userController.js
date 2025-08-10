const User = require("../models/User");

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const role = req.user.role;
    const updates = req.body;

    // Common fields
    let allowedFields = ["name", "email"];

    // Role-specific fields
    if (role === "applicant") {
      allowedFields.push("resume");
    } else if (role === "recruiter") {
      allowedFields.push("company", "designation", "website");
    }

    // Filter only allowed fields
    const filteredUpdates = {};
    for (let key of allowedFields) {
      if (updates[key] !== undefined) {
        filteredUpdates[key] = updates[key];
      }
    }

    const updatedUser = await User.findByIdAndUpdate(userId, filteredUpdates, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while updating profile",
      error: error.message,
    });
  }
};
