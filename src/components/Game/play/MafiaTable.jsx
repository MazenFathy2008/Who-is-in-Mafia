import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { db } from "../../../config/firebase";
import { useParams } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { PHASES } from "./utils/phases";
import * as gameEvents from "./utils/gameEvents";
export default function MafiaTable({ role }) {
  const [players, setPlayers] = useState(null);
  const [radius, setRadius] = useState(0);
  const [shownPlayer, setShownPlayer] = useState(null);
  const { roomId, userId } = useParams();
  const [phase, setPhase] = useState("");
  useEffect(() => {
    const phaseRef = ref(db, `rooms/${roomId}/phase`);
    const unsub = onValue(phaseRef, (snapshot) => {
      setPhase(() => {
        return snapshot.val();
      });
    });
    return unsub;
  }, []);
  useEffect(() => {
    const playersRefrences = ref(db, `rooms/${roomId}/players`);
    onValue(playersRefrences, (snapshot) => {
      const data = snapshot.val();
      Object.keys(data).forEach((key) => {
        if (key != userId) {
          delete data[key].role;
        }
      });
      setPlayers(data);
    });
  }, []);
  useEffect(() => {
    const updateRadius = () => {
      setRadius(Math.min(window.innerWidth, window.innerHeight) * 0.35);
    };

    updateRadius();

    window.addEventListener("resize", updateRadius);

    return () => {
      window.removeEventListener("resize", updateRadius);
    };
  }, []);

  const ids = players && Object.keys(players);
  const listOfPlayers =
    players &&
    Object.keys(players).map((id, index) => {
      const angle = (2 * Math.PI * index) / ids.length;
      const x = Math.cos(angle) * (radius - 30);
      const y = Math.sin(angle) * (radius - 30);
      return (
        <li
          onClick={() => {
            setShownPlayer(players[id]);
          }}
          key={id}
          style={{
            left: `calc(50% + ${x}px)`,
            top: `calc(50% + ${y}px)`,
          }}
          className="absolute
                  rounded-2xl
                  -translate-x-1/2
                  -translate-y-1/2 flex items-center justify-center
                  flex-col
                  select-none
                  cursor-pointer
                  md:text-md text-sm
                  "
        >
          {players[id].username}
          <span className="md:text-5xl text-2xl">
            {players[id].id == userId && role == "mafia"
              ? "🥷"
              : players[id].id == userId && role == "doctor"
                ? "🧑‍⚕️"
                : "🙎‍♂️"}
          </span>
        </li>
      );
    });
  return (
    <main className="overflow-hidden  w-full h-full flex md:items-center items-end p-10 justify-center">
      <ul
        style={{
          width: 2 * radius,
          height: 2 * radius,
        }}
        className={`relative shadow-[0_0_5px_black] rounded-[50%] bg-red-900 `}
      >
        {listOfPlayers}
        <AnimatePresence>
          {shownPlayer && (
            <motion.div
              initial={{
                scale: 0,
              }}
              animate={{
                scale: 1,
              }}
              exit={{
                scale: 0,
              }}
              className="bg-font/70 backdrop-blur-xs
              fixed
              w-95/100 h-75
              md:w-1/2 md:h-1/2
          md:absolute md:top-1/2  left-1/2 
          top-0 
          -translate-x-1/2
          md:-translate-1/2 rounded-2xl shadow-[0_0_5px_black]
          flex flex-col gap-4 p-2
          text-background
          overflow-y-auto
          overflow-x-hidden
          "
            >
              <button
                onClick={() => {
                  setShownPlayer(null);
                }}
                className="w-1/2 self-center rounded-sm bg-red-700 shadow-[0_0_5px_black] 
            hover:scale-95 active:scale-90 transition-all duration-200"
              >
                Close
              </button>
              <p>
                ID:
                <br /> {shownPlayer.id}
              </p>
              <p>
                userName: <br /> {shownPlayer.username}{" "}
              </p>
              <p>
                email:
                <br /> {shownPlayer.email}
              </p>
              {shownPlayer.id == userId && (
                <p>
                  role:
                  <br /> {shownPlayer.role}
                </p>
              )}
              <div className=" w-full flex flex-col gap-2">
                {shownPlayer.id != userId && (
                  <div
                    className={`${
                      phase === PHASES.VOTING
                        ? "bg-Im2 cursor-pointer hover:scale-95 active:scale-90"
                        : "bg-Im1 cursor-not-allowed"
                    } h-10 rounded-lg 
                shadow-lg text-font 
                transition-all flex items-center justify-center 
                duration-200 `}
                  >
                    Vote
                  </div>
                )}
                {shownPlayer.id != userId && role === "mafia" && (
                  <div
                    className={`${
                      phase === PHASES.MAFIA_WAKE
                        ? "bg-red-500 cursor-pointer hover:scale-95 active:scale-90"
                        : "bg-red-900 cursor-not-allowed"
                    } h-10 rounded-lg 
                shadow-lg text-font  
                transition-all duration-200
                flex items-center justify-center
                `}
                    onClick={() => {
                      phase === PHASES.MAFIA_WAKE
                        ? gameEvents.kill(roomId, shownPlayer.id)
                        : "";
                    }}
                  >
                    Kill
                  </div>
                )}
                {role === "doctor" && (
                  <div
                    onClick={() => {
                      phase === PHASES.DOCTOR_WAKE
                        ? gameEvents.heal(roomId, shownPlayer.id)
                        : "";
                    }}
                    className={`${
                      phase === PHASES.DOCTOR_WAKE
                        ? "bg-blue-500 cursor-pointer hover:scale-95 active:scale-90"
                        : "bg-blue-900 cursor-not-allowed"
                    } h-10 rounded-lg 
                shadow-lg text-font 
                transition-all duration-200 flex items-center justify-center`}
                  >
                    heal
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </ul>
    </main>
  );
}
