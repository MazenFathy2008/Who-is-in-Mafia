import { motion } from "motion/react";
export default function LogIn({ flipped,time,setFlipped }) {
  return (
    <motion.div
      animate={{
        opacity: flipped?0:1,
        y: flipped?100:0,

      }}
      transition={{
        duration: time,
      }}
      className='absolute inset-0'
    >
      <h2 className="text-2xl">Please Log In</h2>
      <button
          className="z-10"
          onClick={() => {
            setFlipped((prev) => !prev);
          }}
          type="button"
        >
          Register
      </button>
    </motion.div>
  );
}
