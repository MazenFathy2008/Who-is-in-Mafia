import { motion } from "motion/react";
import { useState } from "react";
import LogIn from "./LogIn";
import Register from "./Register";
import { span } from "motion/react-client";
export default function Main({setErrors}) {
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
        Who Is In
        <img
          src="/Icons/M-icon.png"
          className="
        w-10
        ml-2
        animate-bounce
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
              bg-subBg/40
              border-Im1 backdrop-blur-md
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
        <LogIn setErrors={setErrors}flipped={flipped} time={time + 0.1} setFlipped={setFlipped} />
        <Register setErrors={setErrors}flipped={flipped} time={time + 0.1} setFlipped={setFlipped} />
      </motion.form>
    </div>
  );
}
