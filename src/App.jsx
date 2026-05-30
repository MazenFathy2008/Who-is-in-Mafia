import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LogInAndReges from "./Pages/LoginOrRefs";
import Main from "./Pages/Main";
import Loader from "./components/global/loader";
import { auth } from "./config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { AnimatePresence } from "motion/react";
import User from "./components/main/User"
export const GlobalLoaderProvider = createContext();
export default function App() {
  const [logged, setLogged] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true)
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLogged(true);
        setLoading(false)
      } else {
        setLogged(false);
        setLoading(false)
      }
    });
    return ()=>unsub()
  }, [logged]);
  return (
    <GlobalLoaderProvider.Provider value={setLoading}>
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
        <AnimatePresence>{loading ? <Loader /> : ""}</AnimatePresence>
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
                  <Loader />
                )
              }
            />
            <Route
              path={`/homepage`}
              element={
                logged == true ? (
                  <Main />
                ) : logged == false ? (
                  <Navigate to="/logIn" />
                ) : (
                  null
                )
              }
            >
              <Route path=":userId" element={<User/>}/>
            </Route>
            <Route path="/logIn" element={<LogInAndReges />} />
          </Routes>
        </BrowserRouter>
      </div>
    </GlobalLoaderProvider.Provider>
  );
}
