import { ref, set } from "firebase/database";
import { db } from "../../../../config/firebase";
export const kill = async (roomId, playerId) => {
  const mafiaTargetRef = ref(db, `rooms/${roomId}/mafiaTarget`);
  await set(mafiaTargetRef, playerId);
};
export const heal = async (roomId, playerId) => {
  const doctorTargetRef = ref(db, `rooms/${roomId}/doctorTarget`);
  await set(doctorTargetRef, playerId);
};
