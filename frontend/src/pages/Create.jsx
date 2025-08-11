import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const Create = () => {
  const [form, setForm] = useState({ title: "", description: "", location: "", salaryRange: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/api/jobs", form);
      navigate("/recruiter-dashboard");
    } catch (error) {
      console.error("Job posting failed", error);
      alert("Failed to post job");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-lg mx-auto">
      <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="block w-full mb-2 p-2 border" />
      <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="block w-full mb-2 p-2 border" />
      <input name="location" value={form.location} onChange={handleChange} placeholder="Location" className="block w-full mb-2 p-2 border" />
      <input name="salaryRange" value={form.salaryRange} onChange={handleChange} placeholder="Salary Range" className="block w-full mb-2 p-2 border" />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Post Job</button>
    </form>
  );
};

export default Create;
