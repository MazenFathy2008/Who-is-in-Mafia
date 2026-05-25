import { BrowserRouter, Routes, Route } from "react-router-dom";
import LogInAndReges from "./Pages/LoginOrRefs"
export default function App() {
  return (
    <>
      <div
        className="
      overflow-hidden
      w-full 
      h-dvh
      bg-background
      text-font
      font-Jungle
      flex
      justify-center
      items-center
      flex-col
      "
      >
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LogInAndReges/>}/>
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}
