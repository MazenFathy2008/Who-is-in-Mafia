import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
export default function GameOverLay({ phase }) {
  const overLay = phase;
  return createPortal(
    <div
      className="w-screen h-screen top-0 fixed"
    >
      <AnimatePresence mode="wait">
        {overLay.shown&& (
          <>
            <motion.p
              key={phase}
              initial={{
                opacity: 0,
                x: -50,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 1.5,
              }}
              exit={{
                opacity: 0,
                x: 50,
              }}
              className={`
              ${overLay.color} z-100 font-Jungle absolute top-1/2 
                  left-1/2 text-8xl -translate-1/2 select-none`}
            >
              {overLay.text}
            </motion.p>
            <motion.div
              className="bg-black absolute z-99 h-1/2 w-full"
              exit={{
                y: "-100%",
              }}
              transition={{
                duration: 1.5,
              }}
            ></motion.div>
            <motion.div
              exit={{
                y: "100%",
              }}
              transition={{
                duration: 1.5,
              }}
              className="bg-black absolute bottom-0 z-99 h-1/2 w-full"
            ></motion.div>
          </>     
        )}
      </AnimatePresence>
    </div>,
    document.body,
  );
}
