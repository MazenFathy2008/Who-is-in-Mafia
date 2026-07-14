import { ref, get } from "firebase/database";
import accept from "./accept";
import { db } from "../../../../config/firebase";
export default async function join(userId, roomId) {
  const checkRef = ref(db, `rooms/${roomId}/`);
  const snapshot = await get(checkRef);
  if (snapshot.exists()) {
    const result = await accept(userId, roomId);
    if (result) {
      console.log("joined");
    }
  }else{
    console.log("doesn't exsist")
  }
}
