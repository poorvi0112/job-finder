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
    <nav className="bg-blue-600 p-4 text-white flex justify-between">
      <Link to="/" className="font-bold text-xl">JobFinder</Link>

      <div>
        {!user && (
          <>
            <Link to="/login" className="mx-2">Login</Link>
            <Link to="/register" className="mx-2">Register</Link>
          </>
        )}

        {user && (
          <>
            {user.role === "applicant" && <Link to="/dashboard" className="mx-2">Dashboard</Link>}

            {user.role === "recruiter" && (
              <>
                <Link to="/recruiter-dashboard" className="mx-2">Recruiter Dashboard</Link>
                <Link to="/create-job" className="mx-2">Post Job</Link>
              </>
            )}

            {user.role === "admin" && <Link to="/admin" className="mx-2">Admin Panel</Link>}
            <Link to="/profile" className="mx-2">Profile</Link>
            <button onClick={handleLogout} className="mx-2">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
