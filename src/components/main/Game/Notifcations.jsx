import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
export default function Notifications() {
  const [isShown, setIsShown] = useState(false);
  return (
    <>
      <AnimatePresence>
        {isShown ? (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0,
              x: 150,
              y: -150,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              x:0,
              y:0
            }}
            transition={{
              duration: 0.25,
            }}
            exit={{
              scale: 0,
              x: 150,
              y: -150,
            }}
            className="
      w-97/100 h-97/100 
      md:w-100 md:h-100 
      md:top-5 md:right-5 
      bg-Im1 absolute z-100 
      rounded-2xl
      shadow-lg
      flex
      flex-col
      items-center
      justify-center 
      "
          >
            <ul
              className="
          w-95/100
        h-90/100
        bg-Im2
        rounded-2xl
        p-5
        flex
        flex-col
        gap-5
        "
            >
              <li className="w-full h-1/3 bg-font text-subBg rounded-sm p-2 flex flex-col items-center justify-between">
                Mazen has sent a game invetation to you
                <div className="w-full flex justify-between">
                  <button
                    className="w-40 h-10 bg-green-500 
              rounded-md shadow-lg 
              hover:scale-95 active:scale-90 transition-all duration-200"
                  >
                    Accept
                  </button>
                  <button
                    className="w-40 h-10 bg-red-500 
              rounded-md shadow-lg 
              hover:scale-95 active:scale-90 transition-all duration-200"
                  >
                    Reject
                  </button>
                </div>
              </li>
            </ul>
            <div className="w-full h-5/100 ">
              <button
                onClick={() => {
                  setIsShown(false);
                }}
                className="px-5   flex items-center text-2xl box-border hover:scale-95 transition-all duration-200 active:scale-90"
              >
                Close
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div
        onClick={() => {
          setIsShown(true);
        }}
        className="
    w-10 h-10 bg-Im2 rounded-[50%] flex justify-center 
    md:w-12
    md:h-12
    items-center 
    hover:scale-95
    active:scale-90
    absolute md:top-5 md:right-5 top-2 right-2 hover:shadow-lg shadow-Im1 transition-all duration-200"
      >
        <img
          src="\Icons\Notifications.png"
          className="w-7 md:w-10 rounded-[50%]   "
        />
      </div>
    </>
  );
}
