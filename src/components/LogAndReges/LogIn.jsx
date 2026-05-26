import { motion } from "motion/react";
import {labelStyles,containerStyles,inputStyles,buttonStyles} from "./styles"
export default function LogIn({ flipped, time, setFlipped }) {
  
  return (
    <motion.div
      animate={{
        opacity: flipped ? 0 : 1,
        y: flipped ? 100 : 0,
        pointerEvents: flipped ? "none" : "auto",
      }}
      transition={{
        duration: time,
      }}
      className="
      absolute 
      inset-0 
      p-5
      sm:p-7
      flex
      flex-col
      items-center
      gap-30
      sm:gap-20
      "
    >
      <h2 className="text-2xl">Please Log In</h2>
      <div
        className={containerStyles}
      >
        <input
          type="email"
          name="email"
          id="email"
          autoComplete="none"
          className={inputStyles}
        />
        <label htmlFor="email" className={labelStyles}>
          Enter Your Email
        </label>
      </div>

      <div 
      className={containerStyles}
      >
        <input 
        type="password" 
        name="password" 
        id="password" 
        className={inputStyles}/>
        <label 
        htmlFor="password"
        className={labelStyles}
        >Enter Your Password</label>
      </div>
      <button
        className={buttonStyles}
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
