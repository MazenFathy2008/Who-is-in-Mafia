import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
export default function GameOverLay({ phase }) {
  const currentId = useRef(phase.id);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shown, setShown] = useState(true);
  const overLay = phase?.stages?.[currentIndex] || {};
  const [zIndex, setzIndex] = useState(100);
  const [isFirst, setIsfirst] = useState(true);
  useEffect(() => {
    if (currentId.current !== phase.id) {
      setCurrentIndex(0);
      currentId.current = phase.id;
    }
    if (phase?.stages) {
      let t2;
      if (isFirst) {
        t2 = setTimeout(() => {
          setIsfirst(false);
        }, 1000);
      }
      if (currentIndex + 1 < phase.stages.length) {
        const t = setTimeout(() => {
          setCurrentIndex((prev) => {
            const next = prev + 1;
            setShown(phase.stages[next].shown);
            return next;
          });
        }, phase?.stages?.[currentIndex].duration);
        return () => {
          clearTimeout(t2);
          clearTimeout(t);
        };
      }
    }
  }, [currentIndex, phase]);
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
  }, [currentIndex, phase]);

  return createPortal(
    <div
      style={{
        backgroundColor: isFirst && "black",
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
                  left-1/2 text-8xl -translate-1/2 select-none
                  md:whitespace-nowrap
                  `}
            >
              {overLay.text}
            </motion.p>
            <motion.div
              className="bg-black absolute z-99 h-1/2 w-full"
              initial={{
                y: "-100%",
              }}
              animate={{
                y: 0,
              }}
              exit={{
                y: "-100%",
              }}
              transition={{
                duration: 1,
              }}
            ></motion.div>
            <motion.div
              initial={{
                y: "100%",
              }}
              animate={{
                y: 0,
              }}
              exit={{
                y: "100%",
              }}
              transition={{
                duration: 1,
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
