import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { Link } from "react-router-dom";

function Home() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axiosInstance.get("/api/jobs");
        setJobs(res.data.jobs);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Available Jobs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <div
              key={job._id}
              className="border rounded-xl p-5 shadow-sm bg-white hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold">{job.title}</h2>
              <p className="text-gray-700">{job.company}</p>
              <p className="text-gray-500">{job.location}</p>
              <p className="text-green-600 font-medium">₹{job.salary}</p>
              <p className="text-sm mt-2 text-blue-500">Status: {job.status}</p>
              <p className="text-sm text-gray-400">
                Posted on: {new Date(job.createdAt).toLocaleDateString()}
              </p>
              <Link
                to={`/job/${job._id}`}
                className="inline-block mt-4 text-blue-600 hover:underline"
              >
                View Details →
              </Link>
            </div>
          ))
        ) : (
          <p>No jobs found.</p>
        )}
      </div>
    </div>
  );
}

export default Home;
