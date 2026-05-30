import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import getData from "../db/get";
import Header from "../components/main/Header";
import useStopLoader from "../hooks/useStopLoader";
import {useNavigate,useParams,Outlet} from "react-router-dom"
export default function Main() {
  const [userData, setUserData] = useState(null);
  const stopLoader = useStopLoader();
  const navigate = useNavigate();
  const id = useParams().userId
  console.log(userData )
  useEffect(() => {
    stopLoader;
    getData(id).then((resolve) => {
      setUserData(resolve);
      navigate(`/homepage/${resolve.id}`)
    });
  }, []);
  return (
    <main className="h-full w-full p-5">
      <Header />
      <Outlet/>
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
