import { ref, set, get } from "firebase/database";
import reject from "./reject";
import { db } from "../../../../config/firebase";
export default async function accept(userId, roomId) {
  const roomref = ref(db, `rooms/${roomId}/players/${userId}`);
  const userData = ref(db, `users/${userId}/Profile`);
  const isInCurrentRoom = ref(db, `users/${userId}/Play/currentRoom`);
  const snapshot = await get(userData);
  try {
    await set(roomref, {
      ...snapshot.val(),
      id: userId,
      isHost: false,
    });
    await set(isInCurrentRoom, roomId);
    reject(userId, roomId);
    return true;
  } catch {
    return false;
  }
}
