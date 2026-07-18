import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LogInAndReges from "./Pages/LoginOrRefs";
import Main from "./Pages/Main";
import Loader from "./components/global/loader";
import { auth } from "./config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { AnimatePresence } from "motion/react";
import User from "./components/main/User";
import Profile from "./components/main/Profile";
import Friends from "./components/main/Friends";
import Addfreinds from "./components/main/FriendsSection/AddFriend";
import FriendsList from "./components/main/FriendsSection/FriendsList";
import Requests from "./components/main/FriendsSection/Request.jsx";
import Game from "./components/main/Game.jsx";
import GamePage from "./Pages/Game.jsx";
import Lobby from "./components/Game/lobby.jsx";
import Room from "./components/Game/room.jsx";
import UserLobby from "./components/Game/lobby/user.jsx";
export const GlobalLoaderProvider = createContext();
export default function App() {
  const [logged, setLogged] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLogged(true);
      } else {
        if (auth) {
          setLogged(false);
        }
      }
    });
    return () => unsub();
  }, []);
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
                ) : null
              }
            />
            <Route
              path={`/homepage`}
              element={
                logged == true ? (
                  <Main />
                ) : logged == false ? (
                  <Navigate to="/logIn" />
                ) : null
              }
            >
              <Route path=":userId" element={<User />}>
                <Route path="profile" element={<Profile />} />
                <Route path="play" element={<Game />} />
                <Route path="Friends" element={<Friends />}>
                  <Route
                    index
                    element={<Navigate to="friends-list" replace />}
                  />
                  <Route path="friends-list" element={<FriendsList />} />
                  <Route path="add-friend" element={<Addfreinds />} />
                  <Route path="requests" element={<Requests />} />
                </Route>
              </Route>
            </Route>
            <Route path="/logIn" element={<LogInAndReges />} />
            <Route
              path="/game"
              element={
                logged == true ? (
                  <GamePage />
                ) : logged == false ? (
                  <Navigate to="/logIn" />
                ) : (
                  ""
                )
              }
            >
              <Route path="lobby" element={<Lobby />}>
                <Route path=":roomId" element={<Room />}>
                  <Route path=":userId" element={<UserLobby />} />
                </Route>
              </Route>
              <Route path="play">
                <Route path=":roomId" element={<Room />}>
                  <Route path=":userId" element={<p>s</p>} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </GlobalLoaderProvider.Provider>
  );
}
