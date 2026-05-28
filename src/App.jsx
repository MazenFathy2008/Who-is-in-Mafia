import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LogInAndReges from "./Pages/LoginOrRefs";
import { auth } from "./config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import Main from "./Pages/Main";
export default function App() {
  const [logged, setLogged] = useState(null);
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLogged(true);
      } else {
        setLogged(false);
      }
    });
  }, []);
  return (
    <>
      <div
        className="
      overflow-hidden
      w-full 
      h-dvh
      bg-linear-to-br from-[#1a0b0b] via-[#2a0f14] to-[#0f172a]
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
            <Route
              path="/"
              element={
                logged == true ? (
                  <Navigate to="/homepage" />
                ) : logged == false ? (
                  <Navigate to="/logIn" />
                ) : (
                  "loading"
                )
              }
            />
            <Route
              path="/homepage"
              element={
                logged == true ? (
                  <Main/>
                ) : logged == false ? (
                  <Navigate to="/logIn" />
                ) : (
                  "loading"
                )
              }
            />
            <Route path="/logIn" element={<LogInAndReges />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}
