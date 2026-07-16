import { onValue, ref, remove } from "firebase/database";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../../config/firebase";
import GameFriendsLis from "../../global/GameFriendsList";
import { buttonStyles } from "../../main/styles";
import { disabledButtonstyles } from "../../main/styles";
import Players from "./Players" 
export default function UserLobby() {
  const { roomId, userId } = useParams();
  const [invitedFriends, setInvitedFriends] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const myRef = ref(db, `users/${userId}/Play/currentRoom`);
    const roomRef = ref(db, `rooms/${roomId}/players/${userId}`);
    const unsubUser = onValue(myRef, (snapshot) => {
      if (!snapshot.exists()) {
        navigate("/homepage");
      }
    });
    const unsubRoom = onValue(roomRef, (snapshot) => {
      if (!snapshot.exists()) {
        remove(myRef);
      }
    });
    return () => {
      unsubUser();
      unsubRoom();
    };
  }, []);
  return (
    <section className="w-full h-full grid grid-cols-4 gap-3">
      <GameFriendsLis
        setInvitedFriends={setInvitedFriends}
        buttonStyles={buttonStyles}
        disabledButtonstyles={disabledButtonstyles}
        isInlobby={true}
      />
    <Players/>
    </section>
  );
}
