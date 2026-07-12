import { useParams } from "react-router-dom";
import { onChildAdded, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { db } from "../../../config/firebase";
import { motion, AnimatePresence } from "motion/react";
export default function FriendsList() {
  const [friends, setfriends] = useState(null);
  const uid = useParams().userId;
  useEffect(() => {
    const unsub = onChildAdded(ref(db, `users/${uid}/Friends`), (snapshot) => {
      setfriends((prev) => {
        return {
          ...prev,
          [snapshot.key]: snapshot.val(),
        };
      });
    });
    return unsub;
  }, []);
  const showFriends =
    friends &&
    Object.keys(friends).map((friend) => {
      return <li key={friend}>{friends[friend].username}</li>;
    });
  return (
    <>
      <h1 className="text-3xl">Your Friends</h1>
      <AnimatePresence>
        {friends ? (
          <ul className="min-h-full w-full overflow-y-auto">{showFriends}</ul>
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
