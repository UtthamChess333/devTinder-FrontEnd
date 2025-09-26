import React, { useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";

const Feed = () => {
  const feed = useSelector((store) => store.feed) || []; // fallback to empty array
  const dispatch = useDispatch();

  const getFeed = async () => {
    if (feed.length > 0) return; // already loaded
    try {
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(res?.data?.data || [])); // ensure array
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  if (feed.length === 0) {
    return <h1 className="flex justify-center my-10">No Users found</h1>;
  }

  return (
    <div className="flex justify-center my-10">
      <UserCard user={feed[0]} />
    </div>
  );
};

export default Feed;
