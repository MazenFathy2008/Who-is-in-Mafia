import { Outlet, useNavigate, useOutletContext } from "react-router-dom";
import { buttonStyles } from "./styles";
import { useEffect, useState } from "react";
export default function Friends() {
  const userFriends = useOutletContext()||[];
  const sections = ["friends-list", "add-friend", "requests"];
  const [section, setSection] = useState(sections[0]);
  const navigate = useNavigate();
  const back = ()=>{
    setSection(sections[0])
  }
  useEffect(() => {
    navigate(section);
  }, [section]);
  return (
    <section
      className="
    w-full
    h-full
    flex
    flex-col
    items-center
    justify-start
    py-15 
    px-5 
    "
    >
      <div className="flex-1 w-full md:w-90/100 flex items-center gap-20">
        <button
          className={buttonStyles + `px-0.5 h-1/2 w-full`}
          onClick={() => {
            setSection(sections[1]);
          }}
        >
          Add Friends
        </button>
        <button
          className={buttonStyles + `px-0.5 h-1/2 w-full`}
          onClick={() => {
            setSection(sections[2]);
          }}
        >
          Requests
        </button>
      </div>
      <div
        className="
      flex-3
      shadow-md
    shadow-black
      w-full
      md:w-90/100
      h-full
    bg-subBg/70 backdrop-blur-lg
    border-4
    border-Im1
    rounded-3xl
    max-h-137.5
    flex
    flex-col
    justify-between
    items-center
    p-5
    md:p-7
    overflow-hidden
    
      "
      >
        <Outlet context={{userFriends:userFriends,back:back}} />
      </div>
    </section>
  );
}
