import {ref,get} from "firebase/database"
import {db,auth} from "../config/firebase"
export default async function getData(){
  const user = auth.currentUser
  const refrence = ref(db, `users/${user.uid}`);
  const snapshot = await get(refrence);
  const userData = snapshot.val();
  return userData
}
