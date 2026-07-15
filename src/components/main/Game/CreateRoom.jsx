import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { buttonStyles, disabledButtonstyles } from "../styles";
import { onValue, ref } from "firebase/database";
import { useParams } from "react-router-dom";
import { db } from "../../../config/firebase";
import createNewRoom from "./utils/create";
import useStopLoader from "../../../hooks/useStopLoader";
export default function CreatRoom({ flipped, setFlipped }) {
  const [friends, setFriends] = useState(null);
  const [invitedFriends, setInvitedFriends] = useState();
  const uid = useParams().userId;
  const stopLoader = useStopLoader();
  useEffect(() => {
    const refrence = ref(db, `users/${uid}/Friends`);
    const unsub = onValue(refrence, (snapshot) => {
      const data = snapshot.val();
      setFriends((prev) => {
        if (!data) return null;
        return [
          ...(prev || []),
          ...Object.keys(data).map((key) => {
            return {
              disabled: false,
              id: key,
              ...data[key],
            };
          }),
        ];
      });
      stopLoader();
    });
    return unsub;
  }, []);
  const handleClick = () => {
    createNewRoom(uid, invitedFriends);
  };
  const handleInvite = (data) => {
    setInvitedFriends((prev) => {
      return { ...(prev || {}), [data.id]: { ...data, disabled: null } };
    });
    setFriends((prev) => {
      return prev.map((friend) => {
        if (friend.id == data.id) {
          return {
            ...friend,
            disabled: true,
          };
        }
        return friend;
      });
    });
  };
  const friendsList = friends ? (
    friends.map((friend) => {
      return (
        <li
          key={friend.id}
          className="
        flex w-full justify-between
        "
        >
          {friend.username}
          <div
            onClick={() => {
              friend.disabled ? null : handleInvite(friend);
            }}
            className={
              friend.disabled
                ? disabledButtonstyles + "w-25/100 cursor-not-allowed"
                : buttonStyles.replace(
                    "bg-font",
                    "bg-green-500 cursor-pointer",
                  ) + "w-25/100"
            }
          >
            Invite
          </div>
        </li>
      );
    })
  ) : (
    <motion.p
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.3 }}
      className="w-full h-full flex items-center justify-center text-lg"
    >
      You don't have any Friends till now ....
    </motion.p>
  );
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
      <button
        type="button"
        className={buttonStyles + "w-full"}
        onClick={handleClick}
      >
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
