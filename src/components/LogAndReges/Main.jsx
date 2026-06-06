import { motion } from "motion/react";
import { useState } from "react";
import LogIn from "./LogIn";
import Register from "./Register";
export default function Main({ setErrors }) {
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
        className="
      text-Im2 
      text-5xl 
      whitespace-nowrap cursor-pointer
      select-none
      flex
      items-end
      justify-center
      "
      >
        Who Is In
        <motion.img
          initial={{
            zIndex: 0,
          }}
          whileHover={{
            y: -30,
            animation:false,
          }}
          transition={{
            duration: 0.5,
          }}
          src="/Icons/M-icon.png"
          className="
          relative
        w-25
        -bottom-10
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
        <LogIn
          setErrors={setErrors}
          flipped={flipped}
          time={time + 0.1}
          setFlipped={setFlipped}
        />
        <Register
          setErrors={setErrors}
          flipped={flipped}
          time={time + 0.1}
          setFlipped={setFlipped}
        />
      </motion.form>
    </div>
  );
}
