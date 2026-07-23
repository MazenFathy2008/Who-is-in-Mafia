import { onValue, ref, remove, set, get } from "firebase/database";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import Invitations from "./sections/invetation";
import { db } from "../../../config/firebase";
import Players from "./sections/Players";
export default function UserLobby() {
  const { roomId, userId } = useParams();
  const navigate = useNavigate();
  const [isStarted, setIsstarted] = useState(false);
  useEffect(() => {
    const roomRef = ref(db, `rooms/${roomId}/isStarted`);
    const phaseRef = ref(db, `rooms/${roomId}/phase`);
    const unsub = onValue(roomRef, (snapshot) => {
      if (snapshot.val()) {
        setIsstarted(true);
        set(phaseRef, "night-phase");
      }
    });
    return unsub;
  }, []);
  useEffect(() => {
    const myRef = ref(db, `users/${userId}/Play/currentRoom`);
    const roomRef = ref(db, `rooms/${roomId}/players/${userId}`);
    const unsubUser = onValue(myRef, (snapshot) => {
      if (!snapshot.exists()) {
        navigate("/homepage");
      }
    });
    const unsubRoom = onValue(roomRef, (snapshot) => {
      if (!snapshot.exists()) {
        remove(myRef);
      }
    });
    return () => {
      unsubUser();
      unsubRoom();
    };
  }, []);
  return (
    <section className="w-full grid-rows-8 md:grid-rows-none h-full grid md:grid-cols-4 gap-3">
      {createPortal(
        isStarted && (
          <div className="w-screen h-screen   top-0 fixed">
            <motion.div
              initial={{
                y: "-100%",
              }}
              animate={{
                y: 0,
                transition: {
                  duration: 1,
                },
              }}
              className="bg-black z-100 h-1/2 w-full"
            ></motion.div>
            <motion.div
              initial={{
                y: "100%",
              }}
              animate={{
                y: 0,
                transition: {
                  duration: 1,
                },
              }}
              onAnimationComplete={() => {
                navigate(`/game/play/${roomId}/${userId}`);
                console.log("Navigated");
              }}
              className="bg-black z-100 h-1/2 w-full"
            ></motion.div>
          </div>
        ),
        document.body,
      )}
      <Invitations />
      <Players />
    </section>
  );
}
