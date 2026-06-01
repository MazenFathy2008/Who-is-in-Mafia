import {motion} from "motion/react"
import{useOutletContext} from "react-router-dom"
import { signOut } from "firebase/auth";
import {auth} from "../../config/firebase"
export default function Profile() {
  const userData = useOutletContext();
  const divStyles=`
  border-2
        border-Im2
        h-1/4
        rounded-2xl
        p-5
        flex
        flex-col 
        justify-between
        [box-shadow:0_0_3px]
        text-xl
        overflow-auto
        overflow-y-hidden
  `
  return (
    <section
      className=" 
    w-full 
    h-full 
    py-15 
    px-5 
    flex 
    justify-center
    gap-1
    items-start"
    >
      <motion.section
      animate={{
        y:10
      }}
      transition={{
        duration:1,
        repeat:Infinity,
        repeatType:"reverse",
        ease:"linear"
      }}
        className="
        shadow-md
        shadow-black
      w-full
      h-full
    bg-subBg/70 backdrop-blur-lg
    border-4
    border-Im1
    rounded-3xl
    sm:w-1/4
    max-h-137.5
    flex
    flex-col
    justify-between
    p-5
      "
      >
        <div className={divStyles}>
          Name: <span>{userData?.username}</span>
        </div>
        <div className={divStyles}>
          Email: <span>{userData?.email}</span>
        </div>
        <div className={divStyles}>
          Id: <span>{userData?.id}</span>
        </div>
        <button className=" 
        border-background
        border-4
        h-1/6
        bg-font
        text-subBg
        text-xl
        rounded-4xl
        [box-shadow:0_0_5px_red]
        transtion
        duration-200
        hover:[box-shadow:0_0_10px_red]
        hover:scale-95
        active:scale-90
        "
        onClick={()=>{signOut(auth)}}
        >Log out</button>
      </motion.section>
    </section>
  );
}
