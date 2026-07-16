import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../../../config/firebase";
export default function Players() {
  const [players, setPlayers] = useState(null);
  const { roomId, userId } = useParams();
  useEffect(() => {
    const playersRef = ref(db, `rooms/${roomId}/players`);
    const unsub = onValue(playersRef, (snapshot) => {
      setPlayers(() => {
        return Object.keys(snapshot.val()).map((key) => {
          return snapshot.val()[key];
        });
      });
    });
    return unsub;
  }, []);
  const PlayersList = players
    ? players.map((player) => {
        return (
          <li
            className={`w-full  bg-subBg    
        [box-shadow:0_0_5px_red] h-1/5
        p-2
        md:p-4  rounded-2xl
        flex items-center
        justify-between
        ${
          player.isHost
            ? "outline-4 outline-amber-500 outline-offset-2"
            : player.id == userId
              ? "outline-4 outline-white outline-offset-2"
              : ""
        }
        `}
            key={player.id}
          >
            <span className="flex flex-col h-full">
              Name:
              <span className="text-md">
                {player.username} {player.id == userId ? "(You)" : ""}{" "}
                {player.isHost ? "(Host)" : ""}
              </span>
            </span>
            <span className="flex flex-col h-full">
              Email:
              <span className="text-md">{player.email}</span>
            </span>
            <span className="flex flex-col h-full ">
              Id:
              <span className="text-md">{player.id}</span>
            </span>
          </li>
        );
      })
    : null;
  return (
    <div className="col-span-3 flex flex-col shadow-lg">
      <h1 className="text-2xl bg-Im2/70 backdrop:backdrop-blur-2xl text-center rounded-t-2xl h-1/10 relative top-1">
        Room id: {roomId}
      </h1>
      <ul
        className="
        relative
        z-90
    h-full
    bg-Im1/50 backdrop:backdrop-blur-2xl
    flex 
    flex-col 
    gap-4 p-5 rounded-2xl
    rounded-t-none"
      >
        {PlayersList}
      </ul>
    </div>
  );
}
