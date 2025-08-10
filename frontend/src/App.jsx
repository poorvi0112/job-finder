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
import CreateJob from "./pages/CreateJob";
import EditJob from "./pages/EditJob";
import ManageApplicants from "./pages/ManageApplicants";
import UserProfile from "./pages/UserProfile";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import { useAuth } from "./context/AuthContext";

const App = () => {
  const { user } = useAuth();

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />}/>
        <Route path="/recruiter-dashboard" element={user?.role=="recruiter"?<RecruiterDashboard />: <Navigate to="/login"/>} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/apply/:jobId" element={user? <ApplyToJob />:<Navigate to="/login"/>} />
        <Route path="/admin" element={user?.role=="admin"?<AdminPanel />:<Navigate to="/login"/>} />
        <Route path="/create-job" element={user?.role=="recruiter"?<CreateJob />:<Navigate to="/login"/>} />
        <Route path="/edit-job/:id" element={user?.role=="recruiter"?<EditJob />:<Navigate to="/login"/>} />
        <Route path="/manage-applicants/:id" element={user?.role=="recruiter"?<ManageApplicants />:<Navigate to="/login"/>} />
        <Route path="/profile" element={user? <UserProfile />: <Navigate to="/login" />} />
        <Route path="*" element={<NotFound />} />
        
      </Routes>
    </div>
  );
};

export default App;
