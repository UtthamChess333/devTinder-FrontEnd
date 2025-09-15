import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import { adduser } from "../utils/userSlice"; // adjust path
// import { BASE_URL } from "../utils/constants"; // adjust path3
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";

const EditProfile = () => {
  const user = useSelector((store) => store.user); // logged-in user
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // state variables (pre-filled from redux)
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [emailId, setEmailId] = useState(user?.emailId || "");
  const [password, setPassword] = useState("");
  const [about, setAbout] = useState(user?.about || "");
  const [skills, setSkills] = useState(user?.skills?.join(", ") || "");
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl || "");
  const [age, setAge] = useState(user?.age || "");
  const [gender, setGender] = useState(user?.gender || "");

  // feedback states
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // handle form submit
  const saveProfile = async () => {
    try {
      setLoading(true);

      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        {
          firstName,
          lastName,
          emailId,
          password,
          about,
          skills: skills.split(",").map((s) => s.trim()),
          photoUrl,
          age,
          gender,
        },
        { withCredentials: true }
      );

      dispatch(addUser(res?.data?.data));
      setSuccess("Profile updated successfully!");
      setError("");

      // redirect after short delay
      setTimeout(() => navigate("/profile"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-md bg-white">
      <h2 className="text-xl font-bold mb-4 text-center">Edit Profile</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}
      {success && <p className="text-green-500 mb-2">{success}</p>}

      {/* First Name */}
      <input
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        className="w-full p-2 mb-3 border rounded"
      />

      {/* Last Name */}
      <input
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        className="w-full p-2 mb-3 border rounded"
      />

      {/* Email */}
      <input
        type="email"
        placeholder="Email"
        value={emailId}
        onChange={(e) => setEmailId(e.target.value)}
        className="w-full p-2 mb-3 border rounded"
      />

      {/* Password */}
      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 mb-3 border rounded"
      />

      {/* About */}
      <textarea
        placeholder="About"
        value={about}
        onChange={(e) => setAbout(e.target.value)}
        className="w-full p-2 mb-3 border rounded"
      />

      {/* Skills */}
      <input
        type="text"
        placeholder="Skills (comma separated)"
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
        className="w-full p-2 mb-3 border rounded"
      />

      {/* Photo URL */}
      <input
        type="text"
        placeholder="Profile Photo URL"
        value={photoUrl}
        onChange={(e) => setPhotoUrl(e.target.value)}
        className="w-full p-2 mb-3 border rounded"
      />

      {/* Age */}
      <input
        type="number"
        placeholder="Age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        className="w-full p-2 mb-3 border rounded"
      />

      {/* Gender */}
      <select
        value={gender}
        onChange={(e) => setGender(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      >
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>

      {/* Save Button */}
      <button
        onClick={saveProfile}
        disabled={loading}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Profile"}
      </button>
    </div>
  );
};

export default EditProfile;
