import { ref, set } from "firebase/database";
import { db } from "../../../../config/firebase";
export default function Mafia(roomId) {
  const mafiaReadydRef = ref(db, `rooms/${roomId}/mafiaReady`);
  console.log("entered")
  set(mafiaReadydRef, true);
}
