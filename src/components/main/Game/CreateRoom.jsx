import { motion } from "motion/react";
import { useState } from "react";
import { buttonStyles } from "../styles";
export default function CreatRoom({ flipped, setFlipped }) {
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
      <ul className="w-full h-1/2 border-4 rounded-2xl p-4">
        <li
        className="
        flex w-full justify-between
        "
        >Mazen 
          <button type="button" className=
          { buttonStyles.replace("bg-font", "bg-green-500") + "w-25/100"}>Invite</button>
        </li>
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
