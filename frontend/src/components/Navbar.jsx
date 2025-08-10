import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between">
      <Link to="/" className="font-bold text-xl">
        JobFinder
      </Link>
      <div className="space-x-4">
        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
        {user && (
          <>
            {user.role === "applicant" && <Link to="/dashboard">Dashboard</Link>}
            {user.role === "recruiter" && (
              <>
                <Link to="/recruiter-dashboard">Recruiter Dashboard</Link>
                <Link to="/create-job">Post Job</Link>
              </>
            )}
            {user.role === "admin" && <Link to="/admin">Admin Panel</Link>}
             <Link to="/profile" className="hover:underline">Profile</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;