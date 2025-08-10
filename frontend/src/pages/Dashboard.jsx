import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axiosInstance.get("/api/applications/my-applications");
        setApplications(res.data);
      } catch (error) {
        console.error('Error fetching applications', error);
      }
    };

    if (user?.role === 'applicant') {
      fetchApplications();
    }
  }, [user]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-2">Welcome, {user.name}</h2>
        <p className="text-gray-700">Email: {user.email}</p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">My Applications</h3>
        {applications.length === 0 ? (
          <p className="text-gray-600">No applications found.</p>
        ) : (
          <ul className="space-y-4">
            {applications.map((app) => (
              <li key={app._id} className="p-4 border rounded-lg shadow-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-lg font-bold">{app.job?.title}</h4>
                    <p className="text-gray-700">Company: {app.job?.company}</p>
                    <p className="text-sm text-gray-500">Applied On: {new Date(app.appliedAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                    app.status === 'Pending' ? 'bg-yellow-200 text-yellow-800' :
                    app.status === 'Accepted' ? 'bg-green-200 text-green-800' :
                    'bg-red-200 text-red-800'
                  }`}>
                    {app.status}
                  </span>
                </div>
                <div className="mt-3 flex gap-4">
                  <Link to={`/jobs/${app.job?.id}`} className="text-blue-600 hover:underline">
                    View Job Details
                  </Link>
                  <a
                    href={app.resumeUrl}
                    download
                    className="text-green-600 hover:underline"
                  >
                    Download Resume
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
