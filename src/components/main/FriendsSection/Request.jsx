import { ref, onChildAdded, onChildRemoved, remove } from "firebase/database";
import { db } from "../../../config/firebase";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import acceptRequest from "./utils/acceptReqeust";
import { buttonStyles } from "../styles";
import { AnimatePresence, motion } from "motion/react";
import {useOutletContext} from "react-router-dom"
export default function Requests() {
  const [requests, setRequests] = useState(null);
  const uid = useParams().userId;
  const { back } = useOutletContext();
  const handleClickAccept = (friendId) => {
    acceptRequest(uid, friendId);
  };
  const handleClickReject = (friendId) => {
    const myRef = ref(db, `users/${uid}/requests/${friendId}`);
    const friendRef = ref(db, `users/${friendId}/sentRequests/${uid}`);
    remove(myRef);
    remove(friendRef);
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
            className={buttonStyles.replace("bg-font", "bg-Im1") + "w-25/100"}
            onClick={() => {
              handleClickReject(requestId);
            }}
          >
            Reject
          </button>
          <button
            className={
              buttonStyles.replace("bg-font", "bg-green-500") + "w-25/100"
            }
            onClick={() => {
              handleClickAccept(requestId);
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
  "
    >
      <button
        className="
        underline
        text transition
        duration-200
        hover:scale-110
        active:scale-95
        text-2xl
        hover:[text-shadow:1px_1px_5px_white]
      "
        onClick={() => {
          back();
        }}
      >
        back
      </button>
      <ul
        className={
          "w-full h-full overflow-y-auto overflow-x-hidden p-5 flex flex-col gap-[10%]"
        }
      >
        <AnimatePresence>
          {requests ? (
            requestsList
          ) : (
            <motion.p
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full flex items-center justify-center text-2xl"
            >
              You don't have any Requests Right now 
            </motion.p>
          )}
        </AnimatePresence>
      </ul>
    </div>
  );
}
