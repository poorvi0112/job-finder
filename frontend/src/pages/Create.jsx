import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance"; 
import { useNavigate } from "react-router-dom";

const Create = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    salaryRange: "",
  });

  const navigate = useNavigate();

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
    <form className="p-4 max-w-xl mx-auto" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold mb-4">Post a New Job</h2>

      <input
        type="text"
        placeholder="Title"
        className="block mb-2 p-2 border w-full"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        required
      />

      <textarea
        placeholder="Description"
        className="block mb-2 p-2 border w-full"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        required
      ></textarea>

      <input
        type="text"
        placeholder="Location"
        className="block mb-2 p-2 border w-full"
        value={form.location}
        onChange={(e) => setForm({ ...form, location: e.target.value })}
        required
      />

      <input
        type="text"
        placeholder="Salary Range (e.g., 6-10 LPA)"
        className="block mb-2 p-2 border w-full"
        value={form.salaryRange}
        onChange={(e) => setForm({ ...form, salaryRange: e.target.value })}
        required
      />

      <button
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        type="submit"
      >
        Submit
      </button>
    </form>
  );
};

export default Create;
