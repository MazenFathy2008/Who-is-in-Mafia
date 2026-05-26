import { motion } from "motion/react";
import {
  labelStyles,
  containerStyles,
  inputStyles,
  buttonStyles,
} from "./styles";
import Submit from "./submit"
import {useState} from "react"
export default function LogIn({ flipped, time, setFlipped }) {
  const [showPassword,setPasswordState] = useState(false)
  const handleClick = ()=>{
    setPasswordState(prev=>!prev)
  }
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
      gap-20
      sm:gap-15
      "
    >
      <h2 className="text-2xl">Please Log In</h2>
      <div className={containerStyles}>
        <input
          type="email"
          name="emailLog"
          id="emailLog"
          autoComplete={false}
          className={inputStyles}
          placeholder=" "

        />
        <label htmlFor="emailLog" className={labelStyles}>
          Enter Your Email
        </label>
      </div>

      <div className={containerStyles}>
        <input
          type={showPassword?"text":"password"}
          name="passwordLog"
          id="passwordLog"
          className={inputStyles}
          placeholder=" "
        />
        <label htmlFor="passwordLog" className={labelStyles}>
          Enter Your Password
        </label>
        <img 
        src={showPassword?"/Icons/hide.png":"/Icons/show.png"} 
        onClick={handleClick}
        className="w-7 absolute top-1/2 -translate-y-1/2 right-3"
        />
      </div>
      <Submit page="Log In"/>
      <button
        className={buttonStyles}
        onClick={() => {
          setFlipped((prev) => !prev);
        }}
        type="button"
      >
        Don't have An account? Register
      </button>
    </motion.div>
  );
}
