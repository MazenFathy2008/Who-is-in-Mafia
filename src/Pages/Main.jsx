import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import {useEffect, useState} from "react"
import getData from "../db/get"
export default function Main() {
  const [userData, setUserData] = useState(null)
  useEffect(()=>{
    getData().then((resolve)=>{
      setUserData(userData)
    })
  },[])
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
