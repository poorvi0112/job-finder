import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const ApplyToJob = () => {
  const { jobId } = useParams();
  const [resume, setResume] = useState(null);
  const navigate = useNavigate();

  const handleApply = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("resume", resume);

    try {
      await axiosInstance.post(`/api/applications/apply/${jobId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Application submitted successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to apply");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Upload Resume</h2>
      <form onSubmit={handleApply}>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setResume(e.target.files[0])}
          required
        />
        <button
          type="submit"
          className="ml-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ApplyToJob;