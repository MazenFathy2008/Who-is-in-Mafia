import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../../../config/firebase";
export default function Players() {
  const [players, setPlayers] = useState(null);
  const { roomId, userId } = useParams();
  console.log(players);
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
        console.log(player);
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
                {player.username} {player.id == userId ? "(You)" : ""} {player.isHost?"(Host)":""}
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
    <ul
      className="
    col-span-3 
    bg-Im1 flex 
    flex-col 
    gap-4 p-3 rounded-2xl"
    >
      {PlayersList}
    </ul>
  );
}
