import { AnimatePresence, motion } from "motion/react";
import { onValue, ref} from "firebase/database";
import { db } from "../../config/firebase";
import useStopLoader from "../../hooks/useStopLoader";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
export default function GameFriendsLis({
  setInvitedFriends,
  disabledButtonstyles,
  buttonStyles,
  isInlobby = false,
}) {
  const [friends, setFriends] = useState(null);
  const [players, setPlayers] = useState({});
  const stopLoader = useStopLoader();
  const { userId: uid, roomId } = useParams();
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
  useEffect(() => {
    let newfriends = null;
    const refrence = ref(db, `users/${uid}/Friends`);
    const unsub = onValue(refrence, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        newfriends = [
          ...Object.keys(data).map((key) => {
            return {
              disabled: false,
              id: key,
              ...data[key],
            };
          }),
        ];
      }
      setFriends(newfriends);
    });
    stopLoader();
    return unsub;
  }, []);
  useEffect(() => {
    const roomRef = ref(db, `rooms/${roomId}/players`);
    const unsub = onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      let newPlayers = null;
      if (data) {
        newPlayers = {
          ...data,
        };
        setPlayers(newPlayers);
      }
    });
    return unsub;
  }, []);
  let friendsList =
    friends && friends?.length > 0 ? (
      friends.map((friend) => {
        return !players[friend.id] ? (
          <li
            key={friend.id}
            className="
          flex w-full justify-between
          "
          >
            {friend.username}
            <div
              onClick={() => {
                friend.disabled
                    ? null
                    : handleInvite(friend);
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
        ) : null;
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
  if (friends) {
    friendsList = friendsList.filter((friend) => friend != null);
  }
  friendsList = friendsList.length ? (
    friendsList
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
    <ul
      className={`w-full row-span-5 overflow-x-hidden overflow-y-auto ${isInlobby ? "h-full" : "h-1/2"} border-4 rounded-2xl p-4 gap-3 flex flex-col`}
    >
      <AnimatePresence>{friendsList}</AnimatePresence>
    </ul>
  );
}
