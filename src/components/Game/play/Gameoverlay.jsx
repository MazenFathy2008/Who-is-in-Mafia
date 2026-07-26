import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
export default function GameOverLay({ phase }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shown, setShown] = useState(true);
  const overLay = phase?.stages?.[currentIndex] || {};
  const [zIndex, setzIndex] = useState(100);
  useEffect(() => {
    if (phase?.stages) {
      console.log("IKG");
      if (currentIndex + 1 < phase.stages.length) {
        console.log("entered");
        const t = setTimeout(() => {
          setCurrentIndex((prev) => {
            const next = prev + 1;
            setShown(phase.stages[next].shown);
            return next;
          });
        }, phase?.stages?.[currentIndex].duration);
        return () => {
          clearTimeout(t);
        };
      }
    }
  }, [currentIndex,phase]);
  useEffect(() => {
    setShown(true);
    setzIndex(100);
    if (!phase?.stages?.[currentIndex]) return;
    if (!phase?.stages?.[currentIndex].shown) {
      const t = setTimeout(() => {
        setShown(phase?.stages?.[currentIndex].shown);
        setTimeout(() => {
          setzIndex(-1);
        }, 1500);
      }, overLay.duration);

      return () => {
        clearTimeout(t);
      };
    }
  }, [phase]);
  return createPortal(
    <div
      style={{
        zIndex: zIndex,
      }}
      className="w-screen h-screen top-0 fixed"
    >
      <AnimatePresence mode="wait">
        {shown && (
          <>
            <motion.p
              key={overLay.text}
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
