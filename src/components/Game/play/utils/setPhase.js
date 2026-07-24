import { set,ref } from "firebase/database";
import { db } from "../../../../config/firebase";

export default function setPhase(phase, roomId) {
  const roomRef = ref(db, `rooms/${roomId}/phase`);
  set(roomRef, phase);
}
