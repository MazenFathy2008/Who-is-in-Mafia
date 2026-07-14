import { ref, remove } from "firebase/database";
import { db } from "../../../../config/firebase";
export default function reject(userId, roomId) {
  const userRef = ref(db, `users/${userId}/Play/invetations/${roomId}`);
  const roomRef = ref(db, `rooms/${roomId}/invetations/${userId}`);
  remove(userRef);
  remove(roomRef);
}
