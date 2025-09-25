import React, { useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests } from "../utils/requestSlice";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const res = await axios.get(BASE_URL + "/user/requests/received", {
          withCredentials: true,
        });
        dispatch(addRequests(res?.data?.data));
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchConnections();
  }, [dispatch]);

  if (!requests) return <h1>Loading...</h1>;
  if (requests.length === 0) return <h1>No Requests Found</h1>;

  return (
    <div className="text-center my-10">
      <h1 className="text-bold text-3xl">Requests</h1>
      {requests.map((request) => {
        const { firstName, lastName, photoUrl, age, gender, about, _id } =
          request.fromUserId;
        return (
          <div
            className="flex justify-between items-center m-4 p-4 rounded-lg bg-base-300 w-2/3 mx-auto "
            key={_id}
          >
            <img
              alt="photo"
              className="w-20 h-20 rounded-full"
              src={photoUrl}
            />
            <div className="text-left mx-4">
              <h2 className="font-bold text-xl">
                {firstName + " " + lastName}
              </h2>
              {age && gender && <p>{age + " " + gender}</p>}
              <p>{about}</p>
            </div>
            <div>
              <button className="btn btn-primary mx-2">Reject</button>
              <button className="btn btn-secondary mx-2">Accept</button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Requests;
