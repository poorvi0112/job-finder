import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const JobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axiosInstance.get(`/api/jobs/${jobId}`);
        setJob(res.data);
      } catch (error) {
        console.error("Failed to fetch job", error);
      }
    };
    fetchJob();
  }, [jobId]);

  if (!job) return <div className="p-6">Loading...</div>;

  return (
   <div className="p-6 max-w-3xl mx-auto bg-white rounded shadow">
  <h2 className="text-2xl font-bold mb-4">{job.title}</h2>
  <p className="text-gray-700 mb-2"><strong>Company: </strong> {job.company}</p>
  <p className="text-gray-700 mb-2"><strong>Location: </strong> {job.location}</p>
  <p className="text-gray-700 mb-2"><strong>Posted by: </strong> {job.recruiter?.name}</p>
  <p className="text-gray-700 mb-2"><strong>Salary Range: </strong> {job.salaryRange}</p>
  <p className="text-gray-700 mb-10"><strong>Job Role Description: </strong>{job.description}</p>

  <div className="flex justify-between items-center mt-4">
    <p className="inline-block px-4 py-2 bg-blue-600 text-white font-semibold rounded cursor-default select-none">
      Job status : {job.status}
    </p>

    <button
      onClick={() => navigate(`/apply/${job.id}`)}
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
    >
      Apply Now
    </button>
  </div>
</div>


  );
};

export default JobDetails;
