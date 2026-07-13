import { motion } from "motion/react";
import { useState } from "react";
export default function CreatRoom({ flipped, setFlipped }) {

  return (
    <motion.div
    initial={{
      opacity:0,
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
      Front
      <button onClick={()=>{setFlipped(true)}} type="button">
        JoinRoom
      </button>
    </motion.div>
  );
}
