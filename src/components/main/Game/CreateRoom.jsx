import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { buttonStyles } from "../styles";
import { onValue, ref } from "firebase/database";
import { useParams } from "react-router-dom";
import { db } from "../../../config/firebase";
import { object } from "motion/react-client";
import { array } from "firebase/firestore/pipelines";
export default function CreatRoom({ flipped, setFlipped }) {
  const [friends, setFriends] = useState(null);
  const uid = useParams().userId;
  useEffect(() => {
    console.log(friends);
  }, [friends]);
  useEffect(() => {
    const refrence = ref(db, `users/${uid}/Friends`);
    const unsub = onValue(refrence, (snapshot) => {
      const data = snapshot.val();
      setFriends((prev) => {
        return [
          ...(prev || []),
          ...Object.keys(data).map((key) => {
            return {
              id: key,
              ...data[key],
            };
          }),
        ];
      });
    });
    return unsub;
  }, []);
  const friendsList = friends
    ? friends.map((friend) => {
        return (
          <li
            key={friend.id}
            className="
        flex w-full justify-between
        "
          >
            {friend.username}
            <button
              type="button"
              className={
                buttonStyles.replace("bg-font", "bg-green-500") + "w-25/100"
              }
            >
              Invite
            </button>
          </li>
        );
      })
    : [];
  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: !flipped ? 1 : 0,
        y: !flipped ? 0 : 100,
        pointerEvents: !flipped ? "auto" : "none",
      }}
      transition={{
        duration: 2,
      }}
      className="
    absolute 
      inset-0 
      p-5
      sm:p-7
      flex
      flex-col
      items-center
    gap-9
    sm:gap-10
    justify-between
    "
    >
      <h1>Create Room</h1>
      <ul className="w-full h-1/2 border-4 rounded-2xl p-4 gap-3 flex flex-col">
        {friendsList}
      </ul>
      <button type="button" className={buttonStyles + "w-full"}>
        Create now
      </button>
      <button
        onClick={() => {
          setFlipped(true);
        }}
        type="button"
        className={`z-10 cursor-pointer
  hover:scale-125
  transtion
  duration-200
  border-b-xl
  border-b-font
  underline`}
      >
        Do you want to Join Room
      </button>
    </motion.div>
  );
}
