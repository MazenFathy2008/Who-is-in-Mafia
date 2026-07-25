import { get, onValue, ref, remove } from "firebase/database";
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
      text: role,
      color:
        role === "mafia"
          ? "text-Im1"
          : role === "doctor"
            ? "text-blue-500"
            : "text-font",
      shown: true,
    },

    [PHASES.EVERYONE_WAKE]: {
      text: "Everyone Wake Up",
      color: "text-font",
      shown: false,
    },

    [PHASES.EVERYONE_SLEEP]: {
      text: "Everyone Sleep",
      color: "text-font",
      shown: true,
    },

    [PHASES.MAFIA_WAKE]: {
      text: "Mafia Wake Up",
      color: "text-Im1",
      shown: role !== "mafia",
    },

    [PHASES.MAFIA_SLEEP]: {
      text: "Mafia Sleep",
      color: "text-Im1",
      shown: true,
    },

    [PHASES.DOCTOR_WAKE]: {
      text: "Doctor Wake Up",
      color: "text-blue-500",
      shown: role !== "doctor",
    },

    [PHASES.DOCTOR_SLEEP]: {
      text: "Doctor Sleep",
      color: "text-blue-500",
      shown: true,
    },
    [PHASES.REVEAL_RESULTS]: {
      text: "Night Results",
      color: "text-font",
      shown: false,
    },
    [PHASES.DISCUSSION]: {
      text: "Discussion",
      color: "text-font",
      shown: false,
    },

    [PHASES.VOTING]: {
      text: "Voting Time",
      color: "text-font",
      shown: false,
    },

    [PHASES.REVEAL_VOTE]: {
      text: "Vote Results",
      color: "text-font",
      shown: false,
    },

    [PHASES.SHOW_RESULT]: {
      text: "Night Results",
      color: "text-font",
      shown: false,
    },

    [PHASES.GAME_OVER]: {
      text: "Game Over",
      color: "text-red-500",
      shown: false,
    },
  };
  const [phase, setPhase] = useState(null);
  console.log(phase);
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
    if (isHost) {
      const unsub = phaseConroller.startGameloop(roomId);
      return unsub;
    }
  }, [roomId]);
  useEffect(() => {
    const phaseRef = ref(db, `rooms/${roomId}/phase`);
    const unsub = onValue(phaseRef, (snapshot) => {
      const currentPhase = snapshot.val();
      if (currentPhase && phaseData[currentPhase]) {
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
