import { set, ref } from "firebase/database";
import { PHASES } from "./phases";
import { db } from "../../../../config/firebase";
export async function startGame(roomId) {
  await set(ref(db, `rooms/${roomId}/phase`), PHASES.SHOW_ROLE);
  console.log(roomId)

}
