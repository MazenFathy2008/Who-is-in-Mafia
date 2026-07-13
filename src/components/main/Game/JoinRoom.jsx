import { motion } from "motion/react";
import { useState } from "react";
import { buttonStyles } from "../styles";
export default function JoinRoom({ flipped, setFlipped }) {
  return (
    <motion.div
      initial={{
        rotateY: 180,
        opacity: 0,
      }}
      animate={{
        opacity: flipped ? 1 : 0,
        y: flipped ? 0 : 100,
        pointerEvents: flipped ? "auto" : "none",
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
      <h1>Join room</h1>
      <div className="relative flex w-full items-center justify-center h-fit">
        <input
          type="text"
          id="roomId"
          placeholder=""
          className="border-3
        border-Im1
        focus:border-Im2
        transition
        duration-200
        w-full
        outline-0
        p-2
        box-border
        rounded-2xl
        peer
        "
        />
        <label
          htmlFor="roomId"
          className="       
          absolute
          z-100
          select-none
          top-1/2
          -translate-y-1/2
          left-4
          md:left-1/2
          md:-translate-x-1/2
          text-font
          opacity-50
          transition-all
          duration-200
          peer-focus:opacity-100
          peer-focus:-top-5
          peer-focus:left-5
          md:peer-focus:left-1/2
          peer-focus:sm:left-10 
          peer-focus:scale-125
          peer-focus:sm:scale-150
          peer-not-placeholder-shown:opacity-100
          peer-not-placeholder-shown:-top-5
          peer-not-placeholder-shown:left-5
          md:peer-not-placeholder-shown:left-1/2
          peer-not-placeholder-shown:sm:left-10 
          peer-not-placeholder-shown:scale-125 
          peer-not-placeholder-shown:sm:scale-150"
        >
          Enter room Id
        </label>
      </div>
      <button className={buttonStyles+"w-full"} type="button">Join Now</button>
      <button
        onClick={() => {
          setFlipped(false);
        }}
        type="button"
        className={`z-10 cursor-pointer
  hover:scale-125
  transition
  duration-200
  border-b-xl
  border-b-font
  underline`}
      >
        Do you want to Create Room
      </button>
    </motion.div>
  );
}
