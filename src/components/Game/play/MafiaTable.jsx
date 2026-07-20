import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { db } from "../../../config/firebase";
import { useParams } from "react-router-dom";

export default function MafiaTable() {
  const [players, setPlayers] = useState(null);
  const [radius, setRadius] = useState(0);
  const { roomId, userId } = useParams();
  useEffect(() => {
    const playersRefrences = ref(db, `rooms/${roomId}/players`);
    onValue(playersRefrences, (snapshot) => {
      const data = snapshot.val();
      Object.keys(data).forEach((key) => {
        if (key != userId) {
          delete data[key].role;
        }
      });
      setPlayers(data);
    });
  }, []);
  useEffect(() => {
    const updateRadius = () => {
      setRadius(Math.min(window.innerWidth, window.innerHeight) * 0.35 );
    };

    updateRadius();

    window.addEventListener("resize", updateRadius);

    return () => {
      window.removeEventListener("resize", updateRadius);
    };
  }, []);

  const ids = players && Object.keys(players);
  const listOfPlayers =
    players &&
    Object.keys(players).map((id, index) => {
      const angle = (2 * Math.PI * index) / ids.length;
      const x = Math.cos(angle) * (radius-30);
      const y = Math.sin(angle) * (radius-30);
      return (
        <li
          key={id}
          style={{
            left: `calc(50% + ${x}px)`,
            top: `calc(50% + ${y}px)`,
          }}
          className="absolute
                rounded-2xl
                -translate-x-1/2
                -translate-y-1/2 flex items-center justify-center
                flex-col
                select-none
                cursor-pointer
                "
        >
          {players[id].username}
          <span className="text-3xl">
            {players[id].id == userId && players[id].role == "mafia"
              ? "🥷"
              : players[id].id == userId && players[id].role == "doctor"?"🧑‍⚕️":"🙎‍♂️"}
          </span>
        </li>
      );
    });
  return (
    <main className="overflow-hidden  w-full h-full flex items-center justify-center">
      <ul
        style={{
          width: 2 * radius,
          height: 2 * radius,
        }}
        className={` overflow-hidden shadow-[0_0_5px_black] rounded-[50%] bg-red-900 `}
      >
        {listOfPlayers}
      </ul>
    </main>
  );
}
