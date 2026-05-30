import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import getData from "../db/get";
import Header from "../components/main/Header";
import useStopLoader from "../hooks/useStopLoader";
import { useNavigate, useParams, Outlet } from "react-router-dom";
export default function Main() {
  const [userData, setUserData] = useState(null);
  const [selected, setSelected] = useState("Profile");
  const stopLoader = useStopLoader();
  const navigate = useNavigate();
  const id = useParams().userId;
  useEffect(() => {
    if(userData){
      navigate(`/homepage/${userData.id}/${selected}`);
    }
  }, [selected]);
  useEffect(() => {
    stopLoader;
    getData(id).then((resolve) => {
      setUserData(resolve);
      navigate(`/homepage/${resolve.id}/${selected}`);
    });
  }, []);
  return (
    <main className="h-full w-full p-5">
      <Header selected={selected} setSelected={setSelected} />
      <Outlet />
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
