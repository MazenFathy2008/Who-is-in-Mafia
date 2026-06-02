import { useState } from "react";
import {buttonStyles} from "./styles"
export default function Friends() {
  const [isAddFriend,setIsAddFriend] = useState(false)
  return (
    <section
      className="
    w-full
    h-full
    flex
    flex-col
    py-15 
    px-5 
    "
    >
      <div className="flex-1 flex justify-around items-center gap-20">
        <button onClick={()=>{setIsAddFriend(true)} } className={buttonStyles+`px-0.5 h-1/2 w-full`}>Add Friends</button>
        <button className={buttonStyles+`px-0.5 h-1/2 w-full`}>Requests</button>
      </div>
      <div className="flex-3">Your Friends</div>
      {isAddFriend?<div className="fixed z-100 left-0 top-0 right-0 bottom-0">Add friend</div>:""}
    </section>
  );
}
