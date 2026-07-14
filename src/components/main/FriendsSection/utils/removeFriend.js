import { ref, remove } from "firebase/database";
import { db } from "../../../../config/firebase";
export default function removeFriend(userId, friendId) {
  const myRef = ref(db, `users/${userId}/Friends/${friendId}`);
  const FriednRef = ref(db, `users/${friendId}/Friends/${userId}`);
  remove(myRef);
  remove(FriednRef);
}
