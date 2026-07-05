import { ref, onChildAdded } from "firebase/database";
import { db } from "../../../config/firebase";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
export default function Requests() {
  const [requests, setRequests] = useState(null);
  const uid = useParams().userId;
  useEffect(() => {
    const unsub = onChildAdded(ref(db, `users/${uid}/requests`), (snapshot) => {
      setRequests((prev) => {
        return {
          ...prev,
          [snapshot.key]: snapshot.val(),
        };
      });
    });
    return unsub;
  }, [uid]);
  const requestsList =
    requests &&
    Object.keys(requests).map((requestId) => {
      return <li key={requestId}>{requests[requestId].username}</li>;
    });
  return (
    <div
      className="
  w-full h-full
  p-5
  flex items-center justify-center
  "
    >
      <ul 
      className="w-full h-full">{requestsList}</ul>
    </div>
  );
}
