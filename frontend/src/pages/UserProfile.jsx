import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const UserProfile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    designation: '',
    website: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        company: user.company || '',
        designation: user.designation || '',
        website: user.website || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put("/api/users/update-profile", formData);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Update failed', error);
      alert('Failed to update profile');
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">User Profile</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="email"
          name="email"
          value={formData.email}
          disabled
          className="w-full border p-2 rounded bg-gray-100 cursor-not-allowed"
        />

        {user.role === 'recruiter' && (
          <>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Company"
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              placeholder="Designation"
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="Company Website"
              className="w-full border p-2 rounded"
            />
          </>
        )}

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default UserProfile;
