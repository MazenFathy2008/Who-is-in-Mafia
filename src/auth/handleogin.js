import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
export default async function handleLogin(email, password, throwError) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    if (err.code == "auth/invalid-credential") {
      throwError("Invalid email or password");
    } else {
      console.log(err.code);
    }
  }
}
