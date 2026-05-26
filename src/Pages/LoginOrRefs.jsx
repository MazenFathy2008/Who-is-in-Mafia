import { motion } from "motion/react";
import Main from "../components/LogAndReges/Main";
export default function LogInOrRegs() {
  return (
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
      <Main />
    </motion.div>
  );
}
