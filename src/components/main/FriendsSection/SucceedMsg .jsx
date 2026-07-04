import {motion} from "motion/react"
export default function SucceedMsg({msg}){
  return<motion.div 
  initial={{
    opacity:0
  }}
  animate ={{
    opacity:1
  }}
  exit={{
    opacity:0
  }}
  transition={{
    duration:0.5
  }}
  className="
  absolute z-200 left-0 right-0 top-0 bottom-0
  flex items-center justify-center text-2xl bg-green-500/70
  rounded-xl backdrop-blur-3xl
  ">
      {msg}
    </motion.div>
}