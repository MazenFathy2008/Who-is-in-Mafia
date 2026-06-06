import { auth } from "../config/firebase";
import { useEffect, useState } from "react";
import getData from "../db/get";
import Header from "../components/main/Header";
import useStopLoader from "../hooks/useStopLoader";
import useStartLoader from "../hooks/useStartLoader";
import { useNavigate, Outlet } from "react-router-dom";
export default function Main() {
  const [userData, setUserData] = useState(null);
  const [selected, setSelected] = useState("Profile");
  const stopLoader = useStopLoader();
  const startLoader = useStartLoader();
  const navigate = useNavigate();
  const id = auth.currentUser.uid;
  useEffect(() => {
    getData(id, selected).then((resolve) => {
      startLoader();
      navigate(`/homepage/${id}/${selected}`);
      setUserData(resolve);
      stopLoader();
    });
  }, [selected]);
  return (
    <main className="h-full w-full p-5 overflow-auto flex flex-col">
      <Header selected={selected} setSelected={setSelected} />
      <Outlet
        context={userData}
      />
    </main>
  );
}
