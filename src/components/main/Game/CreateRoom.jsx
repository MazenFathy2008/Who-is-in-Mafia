import { motion } from "motion/react";
import { useState } from "react";
import { buttonStyles, disabledButtonstyles } from "../styles";
import { useParams } from "react-router-dom";
import createNewRoom from "./utils/create";
import GameFriendsLis from "../../global/GameFriendsList";
export default function CreatRoom({ flipped, setFlipped }) {
  const [invitedFriends, setInvitedFriends] = useState();
  const uid = useParams().userId;
  const handleClick = () => {
    createNewRoom(uid, invitedFriends);
  };
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
      <GameFriendsLis
        setInvitedFriends={setInvitedFriends}
        buttonStyles={buttonStyles}
        disabledButtonstyles={disabledButtonstyles}
      />
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
