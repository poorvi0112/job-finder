import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import JobDetails from "./pages/JobDetails";
import AdminPanel from "./pages/AdminPanel";
import ApplyToJob from "./pages/ApplyToJob";
import CreateJob from "./pages/Create";
import EditJob from "./pages/EditJob";
import ManageApplicants from "./pages/ManageApplicants";
import UserProfile from "./pages/UserProfile";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import { useAuth } from "./context/AuthContext";

const App = () => {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
          <Route path="/dashboard" element={user?.role === "applicant" ? <Dashboard /> : <Navigate to="/" />} />
          <Route path="/recruiter-dashboard" element={user?.role === "recruiter" ? <RecruiterDashboard /> : <Navigate to="/" />} />
          <Route path="/admin" element={user?.role === "admin" ? <AdminPanel /> : <Navigate to="/" />} />
          <Route path="/jobs/:jobId" element={<JobDetails />} />
          <Route path="/apply/:jobId" element={user?.role === "applicant" ? <ApplyToJob /> : <Navigate to="/login" />} />
          <Route path="/create-job" element={user?.role === "recruiter" ? <CreateJob /> : <Navigate to="/" />} />
          <Route path="/edit-job/:jobId" element={user?.role === "recruiter" ? <EditJob /> : <Navigate to="/" />} />
          <Route path="/manage-applicants/:jobId" element={user?.role === "recruiter" ? <ManageApplicants /> : <Navigate to="/" />} />
          <Route path="/profile" element={user ? <UserProfile /> : <Navigate to="/login" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
