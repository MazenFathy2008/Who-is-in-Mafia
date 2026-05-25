import { motion } from "motion/react";
import { useState } from "react";
import LogIn from "./LogIn";
import Register from "./Register";
import { span } from "motion/react-client";
export default function Main() {
  const [flipped, setFlipped] = useState(false);
  const time = 1;
  return (
    <div
      className="
    p-4
    w-full
    h-[80%]
    sm:w-[30%]
    flex
    flex-col
    items-center
    perspective-[1000px]
    "
    >
      <motion.h1
        initial={{
          zIndex: 0,
        }}
        whileHover={{
          scale: 1.05,
          y: -30,
        }}
        transition={{
          duration: 0.5,
        }}
        className="
      text-Im2 
      text-5xl 
      relative
      sm:top-7
      whitespace-nowrap cursor-pointer
      select-none
      flex
      "
      >
        Who Is
        <img
          src="/Icons/M-icon.png"
          className="
        w-10
        ml-2
        "
        />
        afia
      </motion.h1>
      <motion.form
        animate={{
          rotateY: flipped ? 180 : 0,
        }}
        transition={{ duration: time }}
        className="
              w-full
              h-full
              bg-subBg
              border-Im1
              border-4
              rounded-4xl
              z-10
              p-5
              flex
              flex-col
              items-center 
              transform-3d
    "
      >
        <LogIn flipped={flipped} time={time + 0.1} setFlipped={setFlipped} />
        <Register flipped={flipped} time={time + 0.1} setFlipped={setFlipped} />
      </motion.form>
    </div>
  );
}
