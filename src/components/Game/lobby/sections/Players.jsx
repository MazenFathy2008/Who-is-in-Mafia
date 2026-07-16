import { get, onValue, ref, remove } from "firebase/database";
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
        if(!snapshot.exists()) return null
        return Object.keys(snapshot.val()).map((key) => {
          return snapshot.val()[key];
        });
      });
    });
    return unsub;
  }, []);
  const handleExite = async (event) => {
    event.target.disabled=true
    const myRef = ref(db, `rooms/${roomId}/players/${userId}`);
    remove(myRef);
    const hostRef = ref(db, `rooms/${roomId}/host/id`);
    const hostId = (await get(hostRef)).val();
    if (hostId == userId) {
      const roomRef = ref(db, `rooms/${roomId}/`);
      remove(roomRef)
    }
  };
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
      <h1
        className="
      text-2xl bg-Im2/70 
      backdrop:backdrop-blur-2xl 
      text-center rounded-t-2xl 
      h-1/10 relative top-1 flex items-center justify-around"
      >
        Room id: {roomId}
        <button
          className="bg-red-900 w-30 rounded-xl 
        transition-all duration-200 hover:scale-95  active:scale-80
        hover:bg-red-500
        "
          onClick={handleExite}
        >
          Exit
        </button>
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
