import { set, ref, get, onValue } from "firebase/database";
import { PHASES } from "./phases";
import { db } from "../../../../config/firebase";
export async function startGame(roomId) {
  await set(ref(db, `rooms/${roomId}/phase`), PHASES.SHOW_ROLE);
  console.log(roomId);
}

export const GAME_FLOW = {
  [PHASES.SHOW_ROLE]: PHASES.EVERYONE_WAKE,
  [PHASES.EVERYONE_WAKE]: PHASES.EVERYONE_SLEEP,
  [PHASES.EVERYONE_SLEEP]: PHASES.MAFIA_WAKE,
  [PHASES.MAFIA_WAKE]: PHASES.MAFIA_SLEEP,
  [PHASES.MAFIA_SLEEP]: PHASES.DOCTOR_WAKE,
  [PHASES.DOCTOR_WAKE]: PHASES.DOCTOR_SLEEP,
  [PHASES.DOCTOR_SLEEP]: PHASES.SHOW_RESULT,
  [PHASES.SHOW_RESULT]: PHASES.DISCUSSION,
  [PHASES.DISCUSSION]: PHASES.VOTING,
  [PHASES.VOTING]: PHASES.REVEAL_VOTE,
  [PHASES.REVEAL_VOTE]: PHASES.EVERYONE_WAKE,
};
export const startGameloop =  (roomId) => {
  const phaseRef = ref(db, `rooms/${roomId}/phase`);
  const currentPhaseShot = onValue(phaseRef, (snapshot) => {
    const currentPhase = snapshot.val();
    if (currentPhase != PHASES.GAME_OVER && currentPhase) {
      setTimeout(() => {
        set(phaseRef, GAME_FLOW[currentPhase]);
      }, 5000);
    }
  });
  return currentPhaseShot;
};
