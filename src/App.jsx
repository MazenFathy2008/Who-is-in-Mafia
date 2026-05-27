import { BrowserRouter, Routes, Route } from "react-router-dom";
import LogInAndReges from "./Pages/LoginOrRefs"
import {auth} from "./config/firebase"
import {onAuthStateChanged} from "firebase/auth"
import {useEffect, useState} from "react"
import Main from "./Pages/Main"
export default function App() {
  const [logged,setLogged] = useState(null)
  useEffect(()=>{
    onAuthStateChanged(auth,(user)=>{
      if(user){
        setLogged(true)
      }else{
        setLogged(false)
      }
    })
  },[])
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
            <Route path="/" element={
              logged==true?<Main/>
              :logged==false?<LogInAndReges/>:"loading"}/>
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}
