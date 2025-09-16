import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";

const EditProfile = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // form states initialized with user data
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl || "");
  const [age, setAge] = useState(user?.age || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [about, setAbout] = useState(
    user?.about || "This is a default about of the user!"
  );

  // feedback states
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // save profile
  const saveProfile = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        {
          firstName,
          lastName,
          photoUrl,
          age: age ? Number(age) : undefined,
          gender: gender.toLowerCase(),
          about,
        },
        { withCredentials: true }
      );

      dispatch(addUser(res?.data?.data));
      setSuccess(res?.data?.message || "Profile updated successfully! ✅");
      setLoading(false);

      setTimeout(() => {
        setSuccess("");
        navigate("/profile");
      }, 3000);
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
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full p-2 mb-3 border rounded bg-gray-700"
        />

        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="w-full p-2 mb-3 border rounded bg-gray-700"
        />

        <input
          type="text"
          placeholder="Photo URL"
          value={photoUrl}
          onChange={(e) => setPhotoUrl(e.target.value)}
          className="w-full p-2 mb-3 border rounded bg-gray-700"
        />

        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="w-full p-2 mb-3 border rounded bg-gray-700"
        />

        <input
          type="text"
          placeholder="Gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="w-full p-2 mb-3 border rounded bg-gray-700"
        />

        <textarea
          placeholder="About"
          value={about}
          onChange={(e) => setAbout(e.target.value)}
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

      {/* Right: Always Visible Live Preview Card */}
      <div className="w-1/3 bg-gray-800 p-6 rounded-lg shadow-md text-center">
        <img
          src={
            photoUrl || user?.photoUrl || "https://via.placeholder.com/150"
          }
          alt="profile"
          className="w-40 h-40 rounded-full mx-auto mb-4 object-cover"
        />
        <h3 className="text-xl font-bold">
          {firstName || user?.firstName} {lastName || user?.lastName}
        </h3>
        <p className="text-gray-300 mt-2">{about || user?.about}</p>
        <p className="text-sm text-gray-400 mt-1">
          {age || user?.age} | {gender || user?.gender}
        </p>

        <div className="flex justify-center mt-6 space-x-4">
          <button className="bg-blue-600 px-4 py-2 rounded-lg">Ignore</button>
          <button className="bg-pink-500 px-4 py-2 rounded-lg">Interested</button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
