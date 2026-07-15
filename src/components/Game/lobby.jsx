import { Outlet } from "react-router-dom";

export default function Lobby(){
  return (<main className="flex-3
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
    md:flex-row
    justify-between
    items-center
    p-5
    md:p-7
    overflow-hidden
    m-10
    box-content
    ">
      <Outlet/>
  </main>)
}