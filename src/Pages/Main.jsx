import { auth } from "../config/firebase";
import { useEffect, useState } from "react";
import Header from "../components/main/Header";
import { useNavigate, Outlet } from "react-router-dom";
export default function Main() {
  const [selected, setSelected] = useState(
    localStorage.getItem("selected") || "Profile",
  );
  const navigate = useNavigate();
  const id = auth.currentUser.uid;
  useEffect(() => {
    localStorage.setItem("selected", selected);
    navigate(`${id}/${selected}`);
  }, [selected]);
  return (
    <main className="h-full w-full p-5 overflow-auto flex flex-col">
      <Header selected={selected} setSelected={setSelected} />
      <Outlet/>
    </main>
  );
}
