import { motion, AnimatePresence } from "motion/react";
import Main from "../components/LogAndReges/Main";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import useStopLoader from "../hooks/useStopLoader"
export default function LogInOrRegs() {
  useStopLoader()
  useEffect(() => {
    signOut(auth);
  }, []);
  const [errors, setErrors] = useState([]);
  return (
    <>
      <motion.div
        initial={{
          y: 150,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
        }}
        className="
      h-full
      w-full
      flex 
      justify-center
      items-center
      overflow-hidden
      perspective-[1000px]
      "
      >
        <ul
          className="
      absolute  
      h-[13%] 
      top-1 
      right-1 
      left-1
      sm:right-0
      sm:left-auto
      sm:w-1/3
      sm:h-full
      p-3
      flex
      flex-col
      items-center
      gap-3
      overflow-y-auto
      overflow-x-hidden
      "
        >
          <AnimatePresence>
            {errors.map((err) => {
              return (
                <motion.li
                  key={err.id}
                  initial={{
                    x: 1000,
                  }}
                  animate={{
                    x: 0,
                  }}
                  exit={{
                    x: 1000,
                  }}
                  transition={{
                    duration: 0.5,
                  }}
                  className="
                border-4 
                border-Im1 
                h-15 
                w-full
                rounded-md
                p-1
                bg-Im2
                text-subBg
                "
                >
                  Error !<p>"{err.msg}"</p>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
        <Main setErrors={setErrors}/>
      </motion.div>
    </>
  );
}
