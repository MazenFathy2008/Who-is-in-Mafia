import { ref, update, get } from "firebase/database";
import { db } from "../../../config/firebase";
import { data, useParams } from "react-router-dom";
import { useState } from "react";
export default function AddFRiendBtn({ friendId }) {
  const uid = useParams().userId;
  const [firndData, setFriendData] = useState(null);
  friendId = friendId === ""? " ":friendId
  
  const handleClike = async () => {
    const Friendreference = ref(db, `users/${friendId}/Profile`);
    const Friendshot = await get(Friendreference);
    if (Friendshot.exists()) {
      console.log(Friendshot.val())
      const myRequests = ref(db,`users/${uid}/sentRequests`);
      const friendrequests = ref(db,`users/${friendId}/requests`);
      await update(myRequests,{
        [friendId]:{
          ...Friendshot.val()
        }
      });
      const myData = await get(ref(db,`users/${uid}/Profile`))
      await update(friendrequests,{
        [uid]:{
          ...myData.val()
        }
      })
      setFriendData(data);
    }
  };
  return (
    <button
      onClick={handleClike}
      className="
    border-2
    w-full
    md:w-1/3
    h-16
    rounded-md cursor-pointer
    shadow-sm
    bg-font
    text-background
    shadow-font
  hover:scale-105
  transtion
  duration-200
  active:scale-110
    "
    >
      Search for friend
    </button>
  );
}
