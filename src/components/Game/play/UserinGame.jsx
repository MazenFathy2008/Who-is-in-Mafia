import { get, onValue, ref } from "firebase/database";
import { useEffect, useRef, useState } from "react";
import { db } from "../../../config/firebase";
import { useNavigate, useParams } from "react-router-dom";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import MafiaTable from "./MafiaTable";
export default function UserInGame() {
  const { roomId, userId } = useParams();
  const navigate = useNavigate();
  const [startWake, setStartWake] = useState(false);
  const [animationFinshed, setAnimationFinshed] = useState(false);
  const [removePortal, setRemovePortal] = useState(false);
  const [role, setRole] = useState(null);
  useEffect(() => {
    const isStartedRef = ref(db, `rooms/${roomId}/isStarted`);
    const unSub = onValue(isStartedRef, (snapshot) => {
      const isStarted = snapshot.val();
      if (!isStarted) {
        navigate(`/game/lobby/${roomId}/${userId}`);
      }
    });

    return unSub;
  }, []);
  const getRole = async () => {
    const roleRef = ref(db, `rooms/${roomId}/players/${userId}/role`);
    const role = await get(roleRef);
    setRole(role.val());
    setTimeout(() => {
      setStartWake(true);
    }, 5000);
    setTimeout(() => {
      setAnimationFinshed(true);
    }, 10000);
    setTimeout(() => {
      setRemovePortal(true);
    }, 12000);
  };
  useEffect(() => {
    getRole();
  }, []);
  return (
    <div className="w-full h-full overflow-hidden">
      {!removePortal &&
        createPortal(
          <div className="w-screen h-screen top-0 fixed">
            <AnimatePresence>
              {!animationFinshed && (
                <>
                  <AnimatePresence mode="wait">
                    {!startWake? (
                      <motion.p
                        key="role"
                        initial={{
                          opacity: 0,
                          x: -50,
                        }}
                        animate={{
                          opacity: 1,
                          x: 0,
                        }}
                        transition={{
                          duration: 1.5,
                        }}
                        exit={{
                          opacity: 0,
                          x: 50,
                        }}
                        className={`
            ${
              role === "mafia"
                ? "text-Im1"
                : role === "doctor"
                  ? "text-blue-500"
                  : "text-font"
            } z-100 font-Jungle absolute top-1/2 
            left-1/2 text-8xl -translate-1/2 select-none`}
                      >
                        {role}
                      </motion.p>
                    ) :  (
                      <motion.p
                        key="wake"
                        initial={{
                          opacity: 0,
                          x: -50,
                        }}
                        animate={{
                          opacity: 1,
                          x: 0,
                        }}
                        transition={{
                          duration: 0.5,
                        }}
                        exit={{
                          opacity: 0,
                        }}
                        className="flex items-center justify-center w-full z-100 font-Jungle absolute top-1/2 
            left-1/2 text-8xl -translate-1/2 select-none text-font"
                      >
                        All the city wake up
                      </motion.p>
                    )}
                  </AnimatePresence>
                  <motion.div
                    className="bg-black z-100 h-1/2 w-full"
                    exit={{
                      y: "-100%",
                    }}
                    transition={{
                      duration: 0.5,
                    }}
                  ></motion.div>
                  <motion.div
                    exit={{
                      y: "100%",
                    }}
                    transition={{
                      duration: 1,
                    }}
                    className="bg-black z-100 h-1/2 w-full"
                  ></motion.div>
                </>
              )}
            </AnimatePresence>
          </div>,
          document.body,
        )}
      <MafiaTable />
    </div>
  );
}
