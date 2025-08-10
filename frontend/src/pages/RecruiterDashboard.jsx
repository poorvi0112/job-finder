import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axiosInstance.get("/api/recruiter/my-jobs");
        setJobs(res.data);
      } catch (error) {
        console.error('Error fetching recruiter jobs', error);
      }
    };

    if (user?.role === 'recruiter') {
      fetchJobs();
    }
  }, [user]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}</h1>
        <p className="text-gray-600">Email: {user?.email}</p>
        <Link
          to="/create-job"
          className="inline-block mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          + Post a New Job
        </Link>
      </div>

      <h2 className="text-2xl font-semibold mb-4">My Posted Jobs</h2>
      {jobs.length === 0 ? (
        <p>No jobs posted yet.</p>
      ) : (
        <ul className="space-y-4">
          {jobs.map((job) => (
            <li key={job._id} className="p-6 border rounded-lg shadow bg-white">
              <h3 className="text-xl font-bold text-blue-800">{job.title}</h3>
              <p className="text-sm text-gray-700">Company: {job.company}</p>
              <p className="text-sm text-gray-700">Location: {job.location}</p>
              <p className="text-sm text-gray-700">
                Applicants: {job.applications?.length || 0}
              </p>

              <div className="mt-3 space-x-4">
                <Link
                  to={`/jobs/${job._id}`}
                  className="text-blue-600 underline text-sm"
                >
                  View Details
                </Link>
                <Link
                  to={`/edit-job/${job._id}`}
                  className="text-yellow-600 underline text-sm"
                >
                  Edit Job
                </Link>
                <Link
                  to={`/manage-applicants/${job._id}`}
                  className="text-purple-600 underline text-sm"
                >
                  Manage Applicants
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecruiterDashboard;
