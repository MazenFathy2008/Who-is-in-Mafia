import {createUserWithEmailAndPassword} from "firebase/auth"
import {auth} from "../config/firebase";
export default async function handleRegs(email,password,throwError) {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.log(err.code)
    throwError("This email  is already exsist");
  }
}
