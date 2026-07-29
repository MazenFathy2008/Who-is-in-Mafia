import { get, onValue, ref, remove, set } from "firebase/database";
import { useEffect, useState, useRef } from "react";
import { db } from "../../../config/firebase";
import { useNavigate, useParams } from "react-router-dom";
import MafiaTable from "./MafiaTable";
import { PHASES } from "./utils/phases";
import GameOverLay from "./Gameoverlay";
import * as phaseConroller from "./utils/phaseConroller";
import * as gameEvents from "./utils/gameEvents";
export default function UserInGame() {
  const { roomId, userId } = useParams();
  const [role, setRole] = useState(null);
  const [doctorKilled, setDoctorKilled] = useState(false);
  const [timer, setTimer] = useState(null);
  const [remaining, setRemaining] = useState(0);
  const navigate = useNavigate();
  const phaseData = {
    [PHASES.SHOW_ROLE]: {
      id: PHASES.SHOW_ROLE,
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
      id: PHASES.EVERYONE_WAKE,
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
      id: PHASES.EVERYONE_SLEEP,
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
      id: PHASES.MAFIA_WAKE,
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
      id: PHASES.MAFIA_SLEEP,
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
      id: PHASES.DOCTOR_WAKE,
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
      id: PHASES.DOCTOR_SLEEP,
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
      id: PHASES.SHOW_RESULT,
      stages: [
        {
          text: "",
          color: "text-Im1",
          shown: true,
          duration: 6000,
        },
        {
          text: "",
          color: "text-blue-500",
          shown: true,
          duration: 6000,
        },
        {
          text: "",
          color: "text-font",
          shown: true,
          duration: 6000,
        },
      ],
    },

    [PHASES.DISCUSSION]: {
      id: PHASES.DISCUSSION,
      stages: [
        {
          text: "Discussion",
          color: "text-font",
          shown: false,
          duration: 3000,
        },
      ],
    },

    [PHASES.VOTING]: {
      id: PHASES.VOTING,
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
      id: PHASES.REVEAL_VOTE,
      stages: [
        {
          text: "sas",
          color: "text-font",
          shown: true,
          duration: 7000,
        },
        {
          text: "asd",
          color: "text-Im1",
          shown: true,
          duration: 7000,
        },
      ],
    },

    [PHASES.GAME_OVER]: {
      id: PHASES.GAME_OVER,
      stages: [
        {
          text: "Game Over",
          color: "text-red-500",
          shown: true,
          duration: 5000,
        },
        {
          text: "",
          color: "text-Im1",
          shown: true,
          duration: 5000,
        },
        {
          text: "",
          color: "text-Im1",
          shown: true,
          duration: 5000,
        },
        {
          text: "",
          color: "text-blue-500",
          shown: true,
          duration: 5000,
        },
      ],
    },
  };

  const [phase, setPhase] = useState(null);
  const [target, setTarget] = useState(null);
  const unsubTarget = useRef(undefined);
  const [votedOn, setVotedOn] = useState(null);
  const unsubVotedOn = useRef(undefined);
  const [winner, setWinner] = useState(null);
  const unSubWinner = useRef(undefined);
  const isHost = async () => {
    const myRef = ref(db, `rooms/${roomId}/players/${userId}/isHost`);
    const isHost = await get(myRef);
    return isHost.val();
  };
  useEffect(() => {
    const myRef = ref(db, `users/${userId}/Play/currentRoom`);
    const roomRef = ref(db, `rooms/${roomId}/players/${userId}`);
    const unsubUser = onValue(myRef, async (snapshot) => {
      if (!snapshot.exists()) {
        if (await isHost()) {
          await remove(ref(db, `rooms/${roomId}`));
        }
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
                remove(ref(db, `rooms/${roomId}/reveal-target`)),
                remove(ref(db, `rooms/${roomId}/winner`)),
                remove(ref(db, `rooms/${roomId}/eliminatedPlayer`)),
                remove(ref(db, `rooms/${roomId}/timer`)),
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
    let clearTime;
    const unsub = onValue(phaseRef, (snapshot) => {
      const currentPhase = snapshot.val();
      if (currentPhase === PHASES.SHOW_RESULT) {
        unsubTarget.current = gameEvents.getTarget(roomId, setTarget);
      } else if (currentPhase === PHASES.REVEAL_VOTE) {
        unsubVotedOn.current = gameEvents.getVotes(roomId, setVotedOn);
      } else if (currentPhase === PHASES.GAME_OVER) {
        isHost().then((resolve) => {
          if (resolve) {
            clearTime = setTimeout(() => {
              set(ref(db, `rooms/${roomId}/isStarted`), false);
            }, 20500);
          }
        });
        unSubWinner.current = gameEvents.getWinner(roomId, setWinner);
      }
      setPhase(phaseData[currentPhase]);
    });
    return () => {
      unsub();
      clearTimeout(clearTime);
    };
  }, [role]);
  useEffect(() => {
    getRole();
  }, []);
  useEffect(() => {
    if (target) {
      const mafiaTargetRef = ref(
        db,
        `rooms/${roomId}/players/${target.mafiaTarget}/username`,
      );
      const doctorTargetRef = ref(
        db,
        `rooms/${roomId}/players/${target.doctorTarget}/username`,
      );
      const doctorKilledRef = ref(db, `rooms/${roomId}/doctorKilled`);
      const data = async () => {
        const killed = (await get(mafiaTargetRef)).val();
        const healed = (await get(doctorTargetRef)).val();
        const doctorKilled = (await get(doctorKilledRef)).val();
        return [killed, healed, doctorKilled];
      };
      data().then(([killed, healed, doctorKilledNow]) => {
        const SHOW_RESULT = [];
        phaseData[PHASES.SHOW_RESULT].stages[0].text = `Mafia killed ${killed}`;
        SHOW_RESULT.push(phaseData[PHASES.SHOW_RESULT].stages[0]);
        if (!doctorKilled && healed) {
          phaseData[PHASES.SHOW_RESULT].stages[1].text =
            `doctor healed ${healed}`;
          SHOW_RESULT.push(phaseData[PHASES.SHOW_RESULT].stages[1]);
        }
        if (target.mafiaTarget === target.doctorTarget) {
          phaseData[PHASES.SHOW_RESULT].stages[2].text =
            `No one was killed ...`;
        } else {
          phaseData[PHASES.SHOW_RESULT].stages[2].color = "text-Im1";
          if (doctorKilledNow && !doctorKilled) {
            phaseData[PHASES.SHOW_RESULT].stages[2].text =
              `${killed} (doctor) is killed`;
            setTimeout(() => {
              setDoctorKilled(true);
            }, 500);
          } else {
            phaseData[PHASES.SHOW_RESULT].stages[2].text =
              `${killed} is killed`;
          }
        }
        SHOW_RESULT.push(phaseData[PHASES.SHOW_RESULT].stages[2]);
        console.log(SHOW_RESULT);
        setPhase({ id: [PHASES.SHOW_RESULT], stages: SHOW_RESULT });
      });
    }
    return () => {
      unsubTarget.current && unsubTarget.current();
    };
  }, [target]);
  useEffect(() => {
    console.log(votedOn);
    if (votedOn) {
      const currentRevealtemp = phaseData[PHASES.REVEAL_VOTE].stages;
      const REVEAL_VOTE = [];
      if (votedOn === "tie") {
        currentRevealtemp[0].text = "tie";
        currentRevealtemp[1].text = "No one Was ejected";
        REVEAL_VOTE.push(currentRevealtemp[0]);
        REVEAL_VOTE.push(currentRevealtemp[1]);
      } else {
        currentRevealtemp[0].text = `${votedOn.username} was ejected by ${votedOn.votes}`;
        REVEAL_VOTE.push(currentRevealtemp[0]);
        if (votedOn.isMafia) {
          currentRevealtemp[1].text = "Mafia Was ejected";
          currentRevealtemp[1].color = "text-blue-500";
        } else if (votedOn.isDoctor) {
          currentRevealtemp[1].text = "Doctor Was ejected";
          currentRevealtemp[1].color = "text-Im1";
        } else {
          currentRevealtemp[1].text = "Citizen Was ejected";
          currentRevealtemp[1].color = "text-font";
        }
        REVEAL_VOTE.push(currentRevealtemp[1]);
      }
      setPhase({ id: PHASES.REVEAL_VOTE, stages: REVEAL_VOTE });
      return () => {
        console.log("data");
        unsubVotedOn.current && unsubVotedOn.current();
      };
    }
  }, [votedOn]);
  useEffect(() => {
    if (winner) {
      const GAME_OVER = phaseData[PHASES.GAME_OVER];
      if (winner.whoWin === "mafia") {
        GAME_OVER.stages[1].text = "mafia Won";
      } else {
        GAME_OVER.stages[1].text = "City Won";
        GAME_OVER.stages[1].color = "text-blue-500";
      }
      GAME_OVER.stages[2].text = `${winner.mafia} was in Mafia`;
      GAME_OVER.stages[3].text = `${winner.doctor} was The doctor`;
      setPhase(GAME_OVER);
    }
  }, [winner]);
  useEffect(() => {
    const unsubTimer = onValue(ref(db, `rooms/${roomId}/timer`), (snapshot) => {
      setTimer(snapshot.val());
    });
    return unsubTimer;
  }, []);
  useEffect(() => {
    if (!timer) return;
    const interval = setInterval(() => {
      const elapsed = Date.now() - timer.startedAt;
      const remaining = Math.max(
        0,
        Math.ceil((timer.duration - elapsed) / 1000),
      );
      setRemaining(remaining);
    }, 100);

    return () => clearInterval(interval);
  }, [timer]);
  return (
    <div className="w-full h-full overflow-hidden">
      <GameOverLay phase={phase || {}} />
      {phase && <MafiaTable role={role} />}
      <div className="z-200 absolute bottom-5 right-5">{remaining}</div>
    </div>
  );
}
