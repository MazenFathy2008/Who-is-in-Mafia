import { motion, AnimatePresence } from "motion/react";
export default function Loader() {
  return (
    <AnimatePresence>
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 1,
        }}
        className="
      z-100
      fixed
      top-0
      bottom-0
      left-0
      right-0
      flex
      items-center
      justify-center
      bg-Im1/50
      backdrop-blur-xl
      "
      >
        <div className="border-l-Im1 animate-spin [animation-duration:2s] absolute w-40 h-40 rounded-[50%] border-8"></div>
        loading . . . .
      </motion.div>
    </AnimatePresence>
  );
}
