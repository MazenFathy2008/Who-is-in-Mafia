import { useParams } from "react-router-dom";
import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { db } from "../../../config/firebase";
import { motion, AnimatePresence } from "motion/react";
import { buttonStyles } from "../styles";
import removeFriend from "./utils/removeFriend";
export default function FriendsList() {
  const [friends, setfriends] = useState(null);
  const uid = useParams().userId;
  useEffect(() => {
    const unsub = onValue(ref(db, `users/${uid}/Friends`), (snapshot) => {
      setfriends(() => {
        return snapshot.val()
          ? {
              ...snapshot.val(),
            }
          : null;
      });
    });
    return unsub;
  }, []);
  const showFriends =
    friends &&
    Object.keys(friends).map((friend) => {
      return (
        <motion.li
          initial={{
            x: -2000,
          }}
          animate={{
            x: 0,
          }}
          transition={{
            duration: 0.5,
          }}
          className="w-full  bg-Im2    
        [box-shadow:0_0_5px_red] h-1/3 
        p-2 
        md:p-10  rounded-2xl
        flex items-center
        justify-between
        "
          key={friend}
        >
          <span className="flex flex-col h-full">
            Name:
            <span className="text-xl">{friends[friend].username}</span>
          </span>
          <span className="flex flex-col h-full">
            Email:
            <span className="text-xl">{friends[friend].email}</span>
          </span>
          <span className="flex flex-col h-full ">
            Id:
            <span className="text-xl">{friend}</span>
          </span>
          <button
            onClick={() => {
              removeFriend(uid, friend);
            }}
            className={buttonStyles.replace("bg-font", "bg-Im1") + "w-50 h-15"}
          >
            Remove
          </button>
        </motion.li>
      );
    });
  return (
    <>
      <h1 className="text-3xl mb-10">Your Friends</h1>
      <AnimatePresence>
        {friends ? (
          <ul className="min-h-full w-full overflow-y-auto p-1 flex flex-col">
            <AnimatePresence>{showFriends}</AnimatePresence>
          </ul>
        ) : (
          <motion.p
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full flex items-center justify-center text-2xl"
          >
            You don't have any Friends till now ....
          </motion.p>
        )}
      </AnimatePresence>
    </>
  );
}
