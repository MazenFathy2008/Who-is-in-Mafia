import { set, ref, get, onValue } from "firebase/database";
import { PHASES } from "./phases";
import { db } from "../../../../config/firebase";
export async function startGame(roomId) {
  await set(ref(db, `rooms/${roomId}/phase`), PHASES.SHOW_ROLE);
  console.log(roomId);
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
    duration: 5000,
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
    duration: 5000,
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
      }
    }
  });
  return currentPhaseShot;
};
