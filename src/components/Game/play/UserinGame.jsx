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
      setAnimationFinshed(true);
    }, 10000);
    setTimeout(() => {
      setRemovePortal(true);
    }, 11500);
  };
  useEffect(() => {
    getRole();
  }, []);
  return (
    <div className="w-full h-full">
      {!removePortal &&
        createPortal(
          <div className="w-screen h-screen top-0 fixed">
            <AnimatePresence>
              {!animationFinshed && (
                <>
                  <motion.p
                    initial={{
                      opacity: 0,
                      x: -50,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    transition={{
                      duration: 1,
                    }}
                    exit={{
                      opacity: 0,
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
                  <motion.div
                    className="bg-black z-100 h-1/2 w-full"
                    exit={{
                      y: "-100%",
                    }}
                    transition={{
                      duration: 1,
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
