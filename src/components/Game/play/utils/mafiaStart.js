import { ref, set } from "firebase/database";
import {db} from "../../../../config/firebase"
export default function Mafia(roomId) {
  const mafiaPlayedRef = ref(db, `rooms/${roomId}/mafiaPlayed`);
  set(mafiaPlayedRef, true);
}
