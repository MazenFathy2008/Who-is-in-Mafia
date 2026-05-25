import {motion} from "motion/react"
export default function Register({flipped,time,setFlipped}){

  return(
    <motion.div 
    initial={
      {
      }
    }
    animate={{
        rotateY:180,
        opacity: !flipped?0:1,
        y: !flipped?100:0,
      }}
      transition={{
        duration: time,
      }}
    className="absolute inset-0 rotate-y-180"
    >
      <h1>
        Register
      </h1>
      <button
          className="z-10"
          onClick={() => {
            setFlipped((prev) => !prev);
          }}
          type="button"
        >Log In
      </button>
    </motion.div>
  )
}