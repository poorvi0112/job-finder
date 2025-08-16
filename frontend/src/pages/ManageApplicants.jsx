import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const ManageApplicants = () => {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await axiosInstance.get(`/api/applications/job/${jobId}`);
        setApplicants(res.data);
      } catch (err) {
        console.error("Error fetching applicants", err);
      }
    };

    fetchApplicants();
  }, [jobId]);

  const updateStatus = async (appId, status) => {
    try {
      await axiosInstance.put(`/api/applications/update-status/${appId}`, { status });
      setApplicants(prev =>
        prev.map(app => app._id === appId ? { ...app, status } : app)
      );
    } catch (err) {
      console.error("Error updating status", err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Manage Applicants</h2>

      {applicants.length === 0 ? (
        <p>No applicants found for this job.</p>
      ) : (
        <div className="space-y-4">
          {applicants.map((app) => (
            <div
              key={app._id}
              className="p-4 border rounded-lg shadow bg-white"
            >
              <p className="font-semibold text-lg">{app.applicant.name}</p>
              <p className="text-sm text-gray-600">{app.applicant.email}</p>
              <p className="text-sm text-gray-500">
                Applied On: {new Date(app.appliedAt).toLocaleDateString()}
              </p>
              <a
                href={app.resume}
                download
                className="inline-block mt-2 text-blue-600 hover:underline"
              >
                Download Resume
              </a>

              <div className="mt-3 flex gap-3">
                <button
                  onClick={() => updateStatus(app._id, "accepted")}
                  className="px-3 py-1 bg-green-500 text-white rounded-lg"
                >
                  Accept
                </button>
                <button
                  onClick={() => updateStatus(app._id, "rejected")}
                  className="px-3 py-1 bg-red-500 text-white rounded-lg"
                >
                  Reject
                </button>
              </div>
              
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageApplicants;
