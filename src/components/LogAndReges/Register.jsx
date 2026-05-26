import {motion} from "motion/react"
import {labelStyles,inputStyles,containerStyles,buttonStyles} from "./styles"
export default function Register({flipped,time,setFlipped}){

  return(
    <motion.div 
    initial={
      {
        rotateY:180,
      }
    }
    animate={{
        
        opacity: !flipped?0:1,
        y: !flipped?100:0,
        pointerEvents: !flipped ? "none" : "auto"
      }}
      transition={{
        duration: time,
      }}
    className="
    
    absolute 
    inset-0 
    rotate-y-180 
    flex 
    flex-col
    p-5
    sm:p-7 
    itmes-center
    gap-20
    sm:gap-15
    "
    >
      <h2 className="text-2xl text-center">
        Please Register
      </h2>
      <div
        className={containerStyles}
      >
        <input
          type="email"
          name="email"
          id="emailRegs"
          autoComplete="none"
          className={inputStyles}
        />
        <label htmlFor="emailRegs" className={labelStyles}>
          Enter Your Email
        </label>
      </div>
      <div
        className={containerStyles}
      >
        <input
          type="text"
          name="userName"
          id="userNameRegs"
          autoComplete="none"
          className={inputStyles}
        />
        <label htmlFor="userNameRegs" className={labelStyles}>
          Enter Your Username
        </label>
      </div>
      <div className={containerStyles}>
        <input
          type="password"
          name="passwordRegs"
          id="passwordRegs"
          className={inputStyles}
        />
        <label htmlFor="passwordRegs" className={labelStyles}>
          Enter Your Password
        </label>
      </div>
      <button
          className={buttonStyles}
          onClick={() => {
            setFlipped((prev) => !prev);
          }}
          type="button"
        >Log In
      </button>
    </motion.div>
  )
}