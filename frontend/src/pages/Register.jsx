import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "applicant",
  });
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const registeredUser = await register(formData);
     if (registeredUser.role === "admin") {
        navigate("/admin");
      } else if (registeredUser.role === "recruiter") {
        navigate("/recruiter-dashboard");
      } else {
        navigate("/dashboard"); // default for applicants
      }
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-2"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-2"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full border p-2"
          required
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full border p-2"
        >
          <option value="applicant">Applicant</option>
          <option value="recruiter">Recruiter</option>
        </select>
        <button type="submit" className="bg-green-600 text-white px-4 py-2">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;