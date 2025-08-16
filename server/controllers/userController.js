const User = require("../models/User");

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const role = req.user.role;
    const updates = req.body;

    let allowedFields = ["name", "email"];
    if (role === "applicant") allowedFields.push("resume");
    else if (role === "recruiter") allowedFields.push("company", "designation", "website");

    const filteredUpdates = {};
    for (let key of allowedFields) {
      if (updates[key] !== undefined) filteredUpdates[key] = updates[key];
    }

    const updatedUser = await User.findByIdAndUpdate(userId, filteredUpdates, {
      new: true,
      runValidators: true
    }).select("-password");

    res.status(200).json({
      success: true,
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        company: updatedUser.company || null,
        designation: updatedUser.designation || null,
        website: updatedUser.website || null
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while updating profile",
      error: error.message
    });
  }
};