import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import HEader from "../components/main/Header";
import getData from "../db/get";
import Header from "../components/main/Header";
import { main } from "motion/react-client";
import Loader from "../components/global/loader"
export default function Main() {
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    getData().then((resolve) => {
      setUserData(userData);
    });
  }, []);
  return (
    <main className="h-full w-full p-5">

      <Header />
      <button
        onClick={() => {
          signOut(auth);
        }}
      >
        log out
      </button>
    </main>
  );
}
