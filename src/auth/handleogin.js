import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";

export default async function useHandleLogin(
  email,
  password,
  throwError,
  navigate,
  stopLoader,
) {
  setLoading(true);
  try {
    await signInWithEmailAndPassword(auth, email, password);
    navigate("/homepage");
  } catch (err) {
    if (err.code == "auth/invalid-credential") {
      throwError("Invalid email or password");
    } else {
      console.log(err);
    }
    stopLoader();
  }
}
