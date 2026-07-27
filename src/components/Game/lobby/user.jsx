import { onValue, ref, remove } from "firebase/database";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Invitations from "./sections/invetation";
import { db } from "../../../config/firebase";
import Players from "./sections/Players";
import GameOverLay from "../play/Gameoverlay";
export default function UserLobby() {
  const { roomId, userId } = useParams();
  const navigate = useNavigate();
  const [isStarted, setIsstarted] = useState(false);
  const phase = {
    id: "start",
    stages: [
      {
        text: "",
        color: "text-red-500",
        shown: isStarted,
        duration: 3000,
      },
    ],
  };
  useEffect(() => {
    const roomRef = ref(db, `rooms/${roomId}/isStarted`);
    const unsub = onValue(roomRef, (snapshot) => {
      if (snapshot.val()) {
        setIsstarted(true);
      }
    });
    return unsub;
  }, []);
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
  useEffect(() => {
    if (isStarted) {
      setTimeout(() => {
        navigate(`/game/play/${roomId}/${userId}`);
      }, phase.stages[0].duration);
    }
  }, [isStarted]);
  return (
    <section className="w-full grid-rows-8 md:grid-rows-none h-full grid md:grid-cols-4 gap-3">
      <GameOverLay phase={phase} />
      <Invitations />
      <Players />
    </section>
  );
}
