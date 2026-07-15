import { onValue, ref } from "firebase/database";
import { db } from "../../../../config/firebase";

export default function isInGame(userId, navigate) {
  const roomRef = ref(db, `users/${userId}/Play/currentRoom`);
  const unsub = onValue(roomRef, (snapshot) => {
    if (snapshot.exists()) {
      navigate(`/game/lobby/${snapshot.val()}/${userId}`);
    }
  });
  return unsub;
}
