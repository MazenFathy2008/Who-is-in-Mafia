import { get, onValue, ref, remove } from "firebase/database";
import { useEffect, useState } from "react";
import { db } from "../../../config/firebase";
import { useNavigate, useParams } from "react-router-dom";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import MafiaTable from "./MafiaTable";
export default function UserInGame() {
  const { roomId, userId } = useParams();
  const navigate = useNavigate();
  const animations = ["role", "wake", "finshed"];
  const [animateState, setanimateState] = useState(animations[0]);
  const [role, setRole] = useState(null);
  const [zIndex, setZindex] = useState(100);
  const isHost = async () => {
    const myRef = ref(db, `rooms/${roomId}/players/${userId}/isHost`);
    const isHost = await get(myRef);
    return isHost.val();
  };
  useEffect(() => {
    const isStartedRef = ref(db, `rooms/${roomId}/isStarted`);
    const unSub = onValue(isStartedRef, (snapshot) => {
      const isStarted = snapshot.val();
      if (!isStarted) {
        isHost()
          .then((resolve) => {
            if (resolve) {
              return Promise.all([
                remove(ref(db, `rooms/${roomId}/phase`)),
                remove(ref(db, `rooms/${roomId}/mafiaTarget`)),
                remove(ref(db, `rooms/${roomId}/doctorTarget`)),
                remove(ref(db, `rooms/${roomId}/mafia/`)),
                remove(ref(db, `rooms/${roomId}/doctor/`)),
              ]);
            }
          })
          .then(() => {
            navigate(`/game/lobby/${roomId}/${userId}`);
          });
      }
    });

    return unSub;
  }, [role]);
  const getRole = async () => {
    const ChekMafiaRef = ref(db, `rooms/${roomId}/mafia/id`);
    const ChekDoctorRef = ref(db, `rooms/${roomId}/doctor/id`);
    let role;
    try {
      role = (await get(ChekMafiaRef)).val();
      if (role === userId) {
        role = "mafia";
      } else {
        role = (await get(ChekDoctorRef)).val();
        if (role === userId) {
          role = "doctor";
        }else{
          role == 'citizen'
        };
      }
    } catch {
      try {
        role = (await get(ChekDoctorRef)).val();
        if (role === userId) {
          role = "doctor";
        } 
      } catch {
        role = "citizen";
      }
    } finally {
      setRole(role);
    }
  };
  useEffect(() => {
    getRole();
    const t1 = setTimeout(() => {
      setanimateState(animations[1]);
      const t2 = setTimeout(() => {
        setanimateState(animations[2]);
        const t3 = setTimeout(() => {
          setZindex(-10);
        }, 1500);
        return () => {
          clearTimeout(t3);
        };
      }, 5000);
      return () => {
        clearTimeout(t2);
      };
    }, 5000);
    return () => {
      clearTimeout(t1);
    };
  }, []);
  return (
    <div className="w-full h-full overflow-hidden">
      {createPortal(
        <div
          style={{
            zIndex: zIndex,
          }}
          className="w-screen h-screen top-0 fixed"
        >
          <>
            <AnimatePresence mode="wait">
              {animateState === animations[0] ? (
                <motion.p
                  key={animations[0]}
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
              ) : animateState === animations[1] ? (
                <motion.p
                  key={animations[1]}
                  className="z-100 font-Jungle absolute top-1/2 
                  left-1/2 md:text-8xl 
                  -translate-1/2 
                  select-none 
                  text-font 
                  w-full flex items-center justify-center text-4xl"
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
                >
                  All the city wake up
                </motion.p>
              ) : (
                ""
              )}
            </AnimatePresence>
            {}
            <AnimatePresence>
              {animateState != animations[2] && (
                <motion.div
                  className="bg-black absolute z-99 h-1/2 w-full"
                  exit={{
                    y: "-100%",
                  }}
                  transition={{
                    duration: 1.5,
                  }}
                ></motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {animateState != animations[2] && (
                <motion.div
                  exit={{
                    y: "100%",
                  }}
                  transition={{
                    duration: 1.5,
                  }}
                  className="bg-black absolute bottom-0 z-99 h-1/2 w-full"
                ></motion.div>
              )}
            </AnimatePresence>
          </>
        </div>,
        document.body,
      )}
      <MafiaTable role={role} />
    </div>
  );
}
