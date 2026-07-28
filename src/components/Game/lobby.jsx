import { Outlet } from "react-router-dom";

export default function Lobby() {
  return (
    <main
      className="
    md:p-4
    flex items-center justify-center
    p-2
    w-full h-screen"
    >
      <div
        className="
      shadow-md
    shadow-black
      w-full
      h-90/100
      md:w-90/100
      md:h-137
    bg-subBg/70 backdrop-blur-lg
    border-4
    border-Im1
    rounded-3xl
    flex
    flex-col
    md:flex-row
    justify-between
    items-center
    p-5
    md:p-3
    overflow-hidden
    box-content
    "
      >
        <Outlet />
      </div>
    </main>
  );
}
