import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const EditJob = () => {
  const { jobId } = useParams();
  const [form, setForm] = useState({ title: "", description: "", location: "", salaryRange: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axiosInstance.get(`/api/jobs/${jobId}`);
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

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/api/jobs/${jobId}`, form);
      alert("Job updated successfully!");
      navigate("/recruiter-dashboard");
    } catch (err) {
      console.error("Error updating job:", err);
      alert("Failed to update job");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await axiosInstance.delete(`/api/jobs/${jobId}`);
      alert("Job deleted successfully!");
      navigate("/recruiter-dashboard");
    } catch (err) {
      console.error("Error deleting job:", err);
      alert("Failed to delete job");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-lg mx-auto">
      <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="block w-full mb-2 p-2 border" />
      <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="block w-full mb-2 p-2 border" />
      <input name="location" value={form.location} onChange={handleChange} placeholder="Location" className="block w-full mb-2 p-2 border" />
      <input name="salaryRange" value={form.salaryRange} onChange={handleChange} placeholder="Salary Range" className="block w-full mb-2 p-2 border" />
      <div className="flex gap-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Update</button>
        <button type="button" onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded">Delete</button>
      </div>
    </form>
  );
};

export default EditJob;
