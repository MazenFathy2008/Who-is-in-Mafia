import { onValue, ref, remove, set, get } from "firebase/database";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Invitations from "./sections/invetation";
import { db } from "../../../config/firebase";
import Players from "./sections/Players";
export default function UserLobby() {
  const { roomId, userId } = useParams();
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
      <Invitations />
      <Players />
    </section>
  );
}
