import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditJob = () => {
  const { jobId } = useParams();
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    salaryRange: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`/api/jobs/${jobId}`);
        setForm({
          title: res.data.title || "",
          description: res.data.description || "",
          location: res.data.location || "",
          salaryRange: res.data.salaryRange || "",
        });
      } catch (err) {
        console.error("Error fetching job details:", err);
      }
    };

    fetchJob();
  }, [jobId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/jobs/${jobId}`, form);
      alert("Job updated successfully!");
      navigate("/recruiterdashboard");
    } catch (err) {
      console.error("Error updating job:", err);
      alert("Failed to update job");
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm("Are you sure you want to delete this job?");
    if (!confirm) return;

    try {
      await axios.delete(`/api/jobs/${jobId}`);
      alert("Job deleted successfully!");
      navigate("/recruiterdashboard");
    } catch (err) {
      console.error("Error deleting job:", err);
      alert("Failed to delete job");
    }
  };

  return (
    <form className="p-4 max-w-xl mx-auto" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold mb-4">Edit Job</h2>

      <input
        type="text"
        name="title"
        placeholder="Job Title"
        className="block w-full mb-3 p-2 border rounded"
        value={form.title}
        onChange={handleChange}
        required
      />

      <textarea
        name="description"
        placeholder="Job Description"
        className="block w-full mb-3 p-2 border rounded"
        value={form.description}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="location"
        placeholder="Location"
        className="block w-full mb-3 p-2 border rounded"
        value={form.location}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="salaryRange"
        placeholder="Salary Range (e.g., 3-5 LPA)"
        className="block w-full mb-3 p-2 border rounded"
        value={form.salaryRange}
        onChange={handleChange}
        required
      />

      <div className="flex gap-4 mt-4">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>

        <button
          type="button"
          onClick={handleDelete}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Delete Job
        </button>
      </div>
    </form>
  );
};

export default EditJob;
