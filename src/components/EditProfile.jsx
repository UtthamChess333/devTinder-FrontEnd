import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";

// Helper for photo URL basic validation (adapt as needed)
const isValidPhotoUrl = (url) => /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(url);

const EditProfile = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Form states initialized with user data
  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    photoUrl: user?.photoUrl || "",
    age: user?.age || "",
    gender: user?.gender || "",
    about: user?.about || ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Track which fields are edited
  const [dirtyFields, setDirtyFields] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setDirtyFields((prev) => ({ ...prev, [name]: value !== user[name] }));
  };

  // Save profile with only changed fields
  const saveProfile = async () => {
    const updatedData = {};
    Object.keys(dirtyFields).forEach((key) => {
      if (dirtyFields[key]) updatedData[key] = form[key];
    });

    // Require at least one field to change
    if (Object.keys(updatedData).length === 0) {
      setError("Please edit at least one field to update your profile.");
      return;
    }

    // Optional photo URL validation
    if (updatedData.photoUrl && !isValidPhotoUrl(updatedData.photoUrl)) {
      setError("Please provide a valid image URL (jpg, jpeg, png, gif, webp).");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const res = await axios.patch(BASE_URL + "/profile/edit", updatedData, { withCredentials: true });

      dispatch(addUser(res?.data?.data));
      setSuccess(res?.data?.message || "Profile updated successfully! ✅");
      setLoading(false);

      setTimeout(() => {
        setSuccess("");
        navigate("/profile/view");
      }, 2000);
    } catch (err) {
      setError(err.response?.data || err.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-900 text-white p-10 space-x-8">
      {/* Left: Edit Form */}
      <div className="w-1/2 bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Edit Profile</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        {success && <p className="text-green-500 mb-2">{success}</p>}

        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={form.firstName}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded bg-gray-700"
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={form.lastName}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded bg-gray-700"
        />
        <input
          type="text"
          name="photoUrl"
          placeholder="Photo URL"
          value={form.photoUrl}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded bg-gray-700"
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={form.age}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded bg-gray-700"
        />
        <input
          type="text"
          name="gender"
          placeholder="Gender"
          value={form.gender}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded bg-gray-700"
        />
        <textarea
          name="about"
          placeholder="About"
          value={form.about}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded bg-gray-700"
        />

        <button
          onClick={saveProfile}
          disabled={loading}
          className="w-full bg-indigo-500 text-white p-2 rounded hover:bg-indigo-600 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </div>

      {/* Right: Live Preview Card (buttons removed) */}
      <div className="w-1/3 bg-gray-800 p-6 rounded-lg shadow-md text-center">
        <img
          src={form.photoUrl || user?.photoUrl || "https://placehold.co/150"}
          alt="profile"
          className="w-40 h-40 rounded-full mx-auto mb-4 object-cover"
        />
        <h3 className="text-xl font-bold">
          {form.firstName || user?.firstName} {form.lastName || user?.lastName}
        </h3>
        <p className="text-gray-300 mt-2">{form.about || user?.about}</p>
        <p className="text-sm text-gray-400 mt-1">
          {form.age || user?.age} | {form.gender || user?.gender}
        </p>
      </div>
    </div>
  );
};

export default EditProfile;
