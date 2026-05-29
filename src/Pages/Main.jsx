import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import getData from "../db/get";
import Header from "../components/main/Header";
import useStopLoader from "../hooks/useStopLoader";
export default function Main() {
  const [userData, setUserData] = useState(null);
  const stopLoader = useStopLoader();

  useEffect(() => {
    stopLoader;
    console.log("An")
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
