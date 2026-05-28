import {createUserWithEmailAndPassword} from "firebase/auth"
import {db} from "../config/firebase"
import {ref,set} from "firebase/database"
import {auth} from "../config/firebase";
export default async function handleRegs(email,password,userName,throwError) {
  try {
    const respond = await createUserWithEmailAndPassword(auth, email, password);
    const user = respond.user
    const refrence = ref(db,`users/${user.uid}`)
    set(refrence,{
      email:user.email,
      username:userName,
      friends:[]
    })
  } catch (err) {
    console.log(err.code)
    throwError("This email  is already exsist");
  }
}
