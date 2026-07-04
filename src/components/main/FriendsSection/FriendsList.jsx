import { useOutletContext, useParams } from "react-router-dom";
import {onChildAdded, ref} from "firebase/database"
import { useEffect, useState } from "react";
import {db} from "../../../config/firebase"
export default function FriendsList() {
  const [friends , setfriends] =useState(null)
  const uid = useParams().userId
  useEffect(()=>{
    const unsub = onChildAdded(ref(db,`users/${uid}/Friends`),(snapshot)=>{
      setfriends((prev)=>{
        return {
          ...prev,
          [snapshot.key]:snapshot.val()
        }
      })
    })
    return unsub
  },[])
  const showFriends = friends && Object.keys(friends).map((friend) => {
    return <li key={friend}>{friends[friend].
username}</li>;
  });
  return (
    <>
      <h1 className="text-3xl">Your Friends</h1>
      <ul className="min-h-full w-full overflow-y-auto">{showFriends}</ul>
    </>
  );
}
