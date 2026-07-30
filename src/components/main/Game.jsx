import { motion } from "motion/react";
import { useEffect, useState } from "react";
import CreatRoom from "./Game/CreateRoom";
import JoinRoom from "./Game/JoinRoom";
import Notifications from "./Game/Notifcations";
import {useNavigate, useParams} from "react-router-dom"
import isInGame from "./Game/utils/checkIfIngame"
export default function Game() {
  const [flipped, setFlipped] = useState(false);
  const uid = useParams().userId
  const navigate = useNavigate()
  useEffect(()=>{
    isInGame(uid,navigate)
  },[])
  return (
    <section className="w-full flex h-full justify-center items-center box-border overflow-hidden relative">
      <Notifications />
      <div
        className="
    p-4
    w-full
    h-[80%]
    sm:w-[30%]
    flex
    flex-col
    items-center justify-center
    perspective-[1000px]
    "
      >
        <motion.div
          animate={{
            rotateY: flipped ? 180 : 0,
          }}
          transition={{ duration: 2 }}
          className="
              w-full
              h-full
              bg-subBg/40
              border-Im1 backdrop-blur-md
              border-4
              rounded-4xl
              z-10
              p-5
              flex
              flex-col
              items-center 
              transform-3d
    "
        >
          <CreatRoom flipped={flipped} setFlipped={setFlipped} />
          <JoinRoom flipped={flipped} setFlipped={setFlipped} />
        </motion.div>
      </div>
    </section>
  );
}
