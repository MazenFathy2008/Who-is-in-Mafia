import {ref,get} from "firebase/database"
import {db} from "../config/firebase"
export default async function getData(id){  
  const refrence = ref(db, `users/${id}`);
  const snapshot = await get(refrence);
  const userData = snapshot.val();
  return {...userData,id:id}
}
