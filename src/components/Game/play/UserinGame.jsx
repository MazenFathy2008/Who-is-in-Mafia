import { onValue, ref } from "firebase/database";
import { useEffect } from "react";
import { db } from "../../../config/firebase";
import { useNavigate, useParams } from "react-router-dom";

export default function UserInGame() {
  const { roomId, userId } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    const isStartedRef = ref(db, `rooms/${roomId}/isStarted`);
    const unSub = onValue(isStartedRef, (snapshot) => {
      const isStarted = snapshot.val();
      if (!isStarted) {
        navigate(`/game/lobby/${roomId}/${userId}`);
      }
    });
    return unSub;
  }, []);
  return <p>play</p>;
}
