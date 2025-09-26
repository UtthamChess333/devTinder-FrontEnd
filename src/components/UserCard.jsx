import React from "react";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ user }) => {
  const { _id, firstName, about, photoUrl } = user;
  const dispatch = useDispatch();

  const handleSendRequest = (status, userId) => {
    try {
      const res = axios.post(
        BASE_URL + "/requests/send/" + status + "/" + userId,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(userId));
    } catch (err) {
      console.log(err.message);
    }
  };
  return (
    <div>
      <div className="card bg-base-300 w-96 shadow-sm">
        <figure>
          <img src={photoUrl} alt="photo" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{firstName}</h2>

          <p>{about}</p>
          <div className="card-actions justify-end">
            <button
              className="btn btn-primary"
              onClick={() => {
                handleSendRequest("ignored", _id);
              }}
            >
              Ignore
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => {
                handleSendRequest("interested", _id);
              }}
            >
              Interested
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
