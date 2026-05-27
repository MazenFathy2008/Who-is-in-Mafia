import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";
export default function Main() {
  return (
    <button
      onClick={() => {
        signOut(auth);
      }}
    >
      log out
    </button>
  );
}
