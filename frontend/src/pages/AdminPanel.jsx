import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";


const AdminPanel = () => {
  const [stats, setStats] = useState({
    totalJobs: 0,
    applicants: 0,
    recruiters: 0,
  });
  const [recruiters, setRecruiters] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsRes = await axiosInstance.get("/api/admin/stats");
        setStats({
          totalJobs: statsRes.data.totalJobs,
          applicants: statsRes.data.totalUsers, // assuming applicants = totalUsers
          recruiters: statsRes.data.totalRecruiters,
        });
      } catch (error) {
        console.error("Error fetching stats", error);
      }
    };

    const fetchRecruiters = async () => {
      try {
        const res = await axiosInstance.get("/api/admin/recruiters");
        setRecruiters(res.data.recruiterData || []);
      } catch (error) {
        console.error("Error fetching recruiters", error);
      }
    };

    fetchStats();
    fetchRecruiters();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-green-100 p-4 rounded-xl text-center">
          <h2 className="text-lg font-semibold">Applicants</h2>
          <p className="text-2xl font-bold">{stats.applicants}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-xl text-center">
          <h2 className="text-lg font-semibold">Recruiters</h2>
          <p className="text-2xl font-bold">{stats.recruiters}</p>
        </div>
        <div className="bg-purple-100 p-4 rounded-xl text-center">
          <h2 className="text-lg font-semibold">Total Jobs</h2>
          <p className="text-2xl font-bold">{stats.totalJobs}</p>
        </div>
      </div>

      {/* Recruiters Overview Table */}
      <div className="mt-10 bg-white p-6 rounded-xl shadow">
        <h3 className="text-xl font-semibold mb-4">Recruiters Overview</h3>
        {recruiters.length === 0 ? (
          <p>No recruiters found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Company</th>
                  <th className="px-4 py-2 text-left">Total Jobs</th>
                </tr>
              </thead>
              <tbody>
                {recruiters.map((rec) => (
                  <tr key={rec.recruiterId} className="border-t">
                    <td className="px-4 py-2">{rec.name}</td>
                    <td className="px-4 py-2">{rec.email}</td>
                    <td className="px-4 py-2">{rec.company}</td>
                    <td className="px-4 py-2">{rec.totalJobsPosted}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
