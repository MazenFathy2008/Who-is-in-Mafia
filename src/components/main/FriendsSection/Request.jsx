import { ref, onChildAdded, onChildRemoved } from "firebase/database";
import { db } from "../../../config/firebase";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import acceptRequest from "./utils/acceptReqeust";
import { buttonStyles } from "../styles";
import { AnimatePresence, motion } from "motion/react";
export default function Requests() {
  const [requests, setRequests] = useState(null);
  const uid = useParams().userId;
  const handleClick = (friendId) => {
    acceptRequest(uid, friendId);
  };
  const requestRef = ref(db, `users/${uid}/requests`);
  useEffect(() => {
    const unsub = onChildAdded(requestRef, (snapshot) => {
      setRequests((prev) => {
        return {
          ...prev,
          [snapshot.key]: snapshot.val(),
        };
      });
    });
    const unsubRem = onChildRemoved(requestRef, (snapshot) => {
      setRequests((prev) => {
        const updated = { ...prev };
        delete updated[snapshot.key];
        return updated;
      });
    });
    return () => {
      unsub();
      unsubRem();
    };
  }, [uid]);
  const requestsList =
    requests &&
    Object.keys(requests).map((requestId) => {
      return (
        <motion.li
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.3 }}
          className="w-full flex items-center justify-between bg-Im2 h-2/10 px-3 rounded-2xl shadow-Im1/70 shadow-2xl"
          key={requestId}
        >
          {requests[requestId].username}
          <button
            className={buttonStyles + "w-25/100"}
            onClick={() => {
              handleClick(requestId);
            }}
          >
            Accept
          </button>
        </motion.li>
      );
    });
  return (
    <div
      className="
  w-full h-full
  flex items-center justify-center
  "
    >
      <ul className="w-full h-full overflow-y-auto overflow-x-hidden p-5 flex flex-col gap-[10%]">
        <AnimatePresence>{requestsList}</AnimatePresence>
      </ul>
    </div>
  );
}
