import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { Link } from "react-router-dom";

function Home() {
  const [jobs, setJobs] = useState([]);

useEffect(() => { 
  const fetchJobs = async () => 
    { try { 
      const res = await axiosInstance.get("/api/jobs");
      setJobs(res.data);
     } catch (err) { 
        console.error("Error fetching jobs:", err);
       } }; 
fetchJobs(); }, []);


  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Latest Jobs</h1>
      {jobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        jobs.map((job) => (
          <div key={job.id} className="border p-3 mb-3 rounded shadow">
            <h2 className="font-bold">{job.title}</h2>
            <p>{job.company} - {job.location}</p>
            <p>₹{job.salaryRange}</p>
            <p>{new Date(job.postedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</p>
             <p><strong>Recruiter</strong> - {job.recruiter}</p>
            <Link to={`/jobs/${job.id}`} className="text-blue-600">View Details →</Link>
          </div>
        ))
      )}
    </div>
  );
}

export default Home;
