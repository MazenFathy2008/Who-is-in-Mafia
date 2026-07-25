import { set, ref, onValue, get, remove } from "firebase/database";
import { PHASES } from "./phases";
import { db } from "../../../../config/firebase";
export async function startGame(roomId) {
  await set(ref(db, `rooms/${roomId}/phase`), PHASES.SHOW_ROLE);
}

export const GAME_FLOW = {
  [PHASES.SHOW_ROLE]: {
    next: PHASES.EVERYONE_WAKE,
    duration: 5000,
    event: false,
  },
  [PHASES.EVERYONE_WAKE]: {
    next: PHASES.EVERYONE_SLEEP,
    duration: 3000,
    event: false,
  },
  [PHASES.EVERYONE_SLEEP]: {
    next: PHASES.MAFIA_WAKE,
    duration: 3000,
    event: false,
  },
  [PHASES.MAFIA_WAKE]: {
    next: PHASES.MAFIA_SLEEP,
    duration: 15000,
    event: true,
  },
  [PHASES.MAFIA_SLEEP]: {
    next: PHASES.DOCTOR_WAKE,
    duration: 3000,
    event: false,
  },
  [PHASES.DOCTOR_WAKE]: {
    next: PHASES.DOCTOR_SLEEP,
    duration: 15000,
    event: true,
  },
  [PHASES.DOCTOR_SLEEP]: {
    next: PHASES.SHOW_RESULT,
    duration: 3000,
    event: false,
  },
  [PHASES.SHOW_RESULT]: {
    next: PHASES.DISCUSSION,
    duration: 20000,
    event: true,
  },
  [PHASES.DISCUSSION]: {
    next: PHASES.VOTING,
    duration: 30000,
    event: false,
  },
  [PHASES.VOTING]: {
    next: PHASES.REVEAL_VOTE,
    duration: 20000,
    event: true,
  },
  [PHASES.REVEAL_VOTE]: {
    next: PHASES.EVERYONE_WAKE,
    duration: 25000,
    event: true,
  },
};
export const startGameloop = (roomId) => {
  const phaseRef = ref(db, `rooms/${roomId}/phase`);
  const currentPhaseShot = onValue(phaseRef, (snapshot) => {
    const currentPhase = snapshot.val();
    if (currentPhase != PHASES.GAME_OVER && currentPhase) {
      if (!GAME_FLOW[currentPhase].event) {
        setTimeout(() => {
          set(phaseRef, GAME_FLOW[currentPhase].next);
        }, GAME_FLOW[currentPhase].duration);
      } else {
        if (currentPhase === PHASES.MAFIA_WAKE) {
          mafiaTurn(roomId, phaseRef, currentPhase);
        } else if (currentPhase === PHASES.DOCTOR_WAKE) {
          doctorTurn(roomId, phaseRef, currentPhase);
        } else if (currentPhase === PHASES.SHOW_RESULT) {
          ShowResults(roomId, phaseRef, currentPhase);
        } else if (currentPhase === PHASES.VOTING) {
          votes(roomId, phaseRef, currentPhase);
        } else if (currentPhase === PHASES.REVEAL_VOTE) {
          revealvote(roomId, phaseRef, currentPhase);
        }
      }
    }
  });
  return () => {
    currentPhaseShot();
  };
};

const mafiaTurn = async (roomId, phaseRef, currentPhase) => {
  const mafiaTargetRef = ref(db, `rooms/${roomId}/mafiaTarget`);
  const unsubMafiaTarget = onValue(mafiaTargetRef, async (snapshot) => {
    if (snapshot.exists()) {
      await set(phaseRef, GAME_FLOW[currentPhase].next);
      unsubMafiaTarget();
    }
  });
};
const doctorTurn = async (roomId, phaseRef, currentPhase) => {
  const doctorTargetRef = ref(db, `rooms/${roomId}/doctorTarget`);
  const unsubDoctorTarget = onValue(doctorTargetRef, async (snapshot) => {
    if (snapshot.exists()) {
      await set(phaseRef, GAME_FLOW[currentPhase].next);
      unsubDoctorTarget();
    }
  });
};
const ShowResults = async (roomId, phaseRef, currentPhase) => {
  const mafiaTargetRef = ref(db, `rooms/${roomId}/mafiaTarget`);
  const doctorTargetRef = ref(db, `rooms/${roomId}/doctorTarget`);
  const revealTargetRef = ref(db, `rooms/${roomId}/reveal-target`);
  const mafiaTarget = (await get(mafiaTargetRef)).val();
  const doctorTarget = (await get(doctorTargetRef)).val();
  if (mafiaTarget !== doctorTarget) {
    await set(ref(db, `rooms/${roomId}/players/${mafiaTarget}/killed`), true);
  }
  set(revealTargetRef, {
    doctorTarget: doctorTarget,
    mafiaTarget: mafiaTarget,
  });
  setTimeout(async () => {
    try {
      await remove(revealTargetRef);
      await remove(doctorTargetRef);
      await remove(mafiaTargetRef);
      await set(phaseRef, GAME_FLOW[currentPhase].next);
    } catch {
      set(phaseRef, currentPhase);
    }
  }, GAME_FLOW[currentPhase].duration);
};
const votes = async (roomId, phaseRef, currentPhase) => {
  const votesRef = ref(db, `rooms/${roomId}/votes`);
  const unSubVotes = onValue(votesRef, async (snapshot) => {
    if (!snapshot.exists()) return;
    const votesData = snapshot.val();
    const players = (await get(ref(db, `rooms/${roomId}/players`))).val();
    const alivePlayers = Object.keys(players).filter(
      (id) => !players[id].killed,
    );
    if (votesData.sum === alivePlayers.length) {
      await set(phaseRef, GAME_FLOW[currentPhase].next);
      unSubVotes();
    }
  });
};
const revealvote = async (roomId, phaseRef, currentPhase) => {
  const votesRef = ref(db, `rooms/${roomId}/votes`);
  const playersRef = ref(db, `rooms/${roomId}/players`);
  const players = await get(playersRef);
  const newData = {};
  Object.keys(players.val()).forEach((id) => {
    newData[id] = {
      ...players.val()[id],
      voted: null,
    };
  });
  setTimeout(async () => {
    await remove(votesRef);
    await set(playersRef, newData);
    await set(phaseRef, GAME_FLOW[currentPhase].next);
  },GAME_FLOW[currentPhase].duration);
};
