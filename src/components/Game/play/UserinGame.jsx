import { get, onValue, ref, remove, set } from "firebase/database";
import { useEffect, useState } from "react";
import { db } from "../../../config/firebase";
import { useNavigate, useParams } from "react-router-dom";
import MafiaTable from "./MafiaTable";
import { PHASES } from "./utils/phases";
import GameOverLay from "./Gameoverlay";
import * as phaseConroller from "./utils/phaseConroller";
export default function UserInGame() {
  const { roomId, userId } = useParams();
  const [role, setRole] = useState(null);
  const navigate = useNavigate();
  const phaseData = {
    [PHASES.SHOW_ROLE]: {
      stages: [
        {
          text: role,
          color:
            role === "mafia"
              ? "text-Im1"
              : role === "doctor"
                ? "text-blue-500"
                : "text-font",
          shown: true,
          duration: 5000,
        },
      ],
    },

    [PHASES.EVERYONE_WAKE]: {
      stages: [
        {
          text: "Everyone Wake Up",
          color: "text-font",
          shown: false,
          duration: 3000,
        },
      ],
    },

    [PHASES.EVERYONE_SLEEP]: {
      stages: [
        {
          text: "Everyone Sleep",
          color: "text-font",
          shown: true,
          duration: 3000,
        },
      ],
    },

    [PHASES.MAFIA_WAKE]: {
      stages: [
        {
          text: "Mafia Wake Up",
          color: "text-Im1",
          shown: role !== "mafia",
          duration: 3000,
        },
      ],
    },

    [PHASES.MAFIA_SLEEP]: {
      stages: [
        {
          text: "Mafia Sleep",
          color: "text-Im1",
          shown: true,
          duration: 3000,
        },
      ],
    },

    [PHASES.DOCTOR_WAKE]: {
      stages: [
        {
          text: "Doctor Wake Up",
          color: "text-blue-500",
          shown: role !== "doctor",
          duration: 3000,
        },
      ],
    },

    [PHASES.DOCTOR_SLEEP]: {
      stages: [
        {
          text: "Doctor Sleep",
          color: "text-blue-500",
          shown: true,
          duration: 3000,
        },
      ],
    },

    [PHASES.SHOW_RESULT]: {
      stages: [
        {
          text: "Mafia chose...",
          color: "text-Im1",
          shown: true,
          duration: 6000,
        },
        {
          text: "Doctor saved...",
          color: "text-blue-500",
          shown: true,
          duration: 6000,
        },
        {
          text: "Nobody died", 
          color: "text-font",
          shown: true,
          duration: 6000,
        },
      ],
    },

    [PHASES.DISCUSSION]: {
      stages: [
        {
          text: "Discussion",
          color: "text-font",
          shown: false,
          duration: 30000,
        },
      ],
    },

    [PHASES.VOTING]: {
      stages: [
        {
          text: "Voting Time",
          color: "text-font",
          shown: false,
          duration: 5000,
        },
      ],
    },

    [PHASES.REVEAL_VOTE]: {
      stages: [
        {
          text: "You voted for...",
          color: "text-font",
          shown: true,
          duration: 7000,
        },
        {
          text: "He was Mafia!",
          color: "text-Im1",
          shown: true,
          duration: 7000,
        },
      ],
    },

    [PHASES.GAME_OVER]: {
      stages: [
        {
          text: "Game Over",
          color: "text-red-500",
          shown: false,
          duration: 5000,
        },
      ],
    },
  };
  const [phase, setPhase] = useState(null);
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
          .then(async (resolve) => {
            if (resolve) {
              await Promise.all([
                remove(ref(db, `rooms/${roomId}/phase`)),
                remove(ref(db, `rooms/${roomId}/mafiaTarget`)),
                remove(ref(db, `rooms/${roomId}/doctorTarget`)),
                remove(ref(db, `rooms/${roomId}/mafia/`)),
                remove(ref(db, `rooms/${roomId}/doctor/`)),
                remove(ref(db, `rooms/${roomId}/doctorKilled/`)),
                remove(ref(db, `rooms/${roomId}/votes/`)),
              ]);
              const playersRef = ref(db, `rooms/${roomId}/players`);
              const snapshot = await get(playersRef);
              const cleanPlayers = {};
              const players = snapshot.val();
              if (!players) {
                navigate(`/game/lobby/${roomId}/${userId}`);
                return;
              }
              Object.keys(players).forEach((id) => {
                cleanPlayers[id] = {
                  ...players[id],
                  voted: null,
                  killed: null,
                };
              });
              await set(playersRef, cleanPlayers);
            }
          })
          .finally(() => {
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
        throw new Error("you aren't the mafia");
      }
    } catch {
      try {
        role = (await get(ChekDoctorRef)).val();
        if (role === userId) {
          role = "doctor";
        } else {
          throw new Error("you aren't the doctor");
        }
      } catch {
        role = "citizen";
      }
    } finally {
      setRole(role);
    }
  };
  useEffect(() => {
    let unsub = undefined;
    isHost().then((resolve) => {
      if (resolve) {
        unsub = phaseConroller.startGameloop(roomId);
      }
    });
    return unsub;
  }, [roomId]);
  useEffect(() => {
    const phaseRef = ref(db, `rooms/${roomId}/phase`);
    const unsub = onValue(phaseRef, (snapshot) => {
      const currentPhase = snapshot.val();
      if (currentPhase === PHASES.GAME_OVER) {
        isHost().then((resolve) => {
          if (resolve) {
            set(ref(db, `rooms/${roomId}/isStarted`), false);
          }
        });
      } else if (currentPhase && phaseData[currentPhase]) {
        setPhase(phaseData[currentPhase]);
      }
    });
    return unsub;
  }, [role]);
  useEffect(() => {
    getRole();
  }, []);
  return (
    <div className="w-full h-full overflow-hidden">
      <GameOverLay phase={phase || {}} />
      {phase && <MafiaTable role={role} />}
    </div>
  );
}
