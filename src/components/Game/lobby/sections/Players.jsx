import { get, onValue, ref, remove, set } from "firebase/database";
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
        if (!snapshot.exists()) return null;
        return snapshot.val();
      });
    });
    return unsub;
  }, []);
  const handleExite = async (event) => {
    event.target.disabled = true;
    const myRef = ref(db, `rooms/${roomId}/players/${userId}`);
    await remove(myRef);
    const hostRef = ref(db, `rooms/${roomId}/host/id`);
    const hostId = (await get(hostRef)).val();
    if (hostId == userId) {
      const roomRef = ref(db, `rooms/${roomId}/`);
      await remove(roomRef);
    }
  };
  const chooseDoc = (mafiaId, idList) => {
    const candidates = idList.filter((id) => id !== mafiaId);
    return candidates[Math.floor(Math.random() * candidates.length)];
  };
  const handleStart = async (event) => {
    event.target.disabled = true;
    if (players[userId].isHost) {
      const roomRef = ref(db, `rooms/${roomId}/isStarted`);
      const idList = Object.keys(players);
      const mafia = idList[Math.floor(Math.random() * idList.length)];
      const doctor = chooseDoc(mafia, idList);
      const Allpromises = idList.map((id) => {
        const playerRef = ref(db, `rooms/${roomId}/players/${id}/role`);

        if (id === mafia) {
          return set(playerRef, "mafia");
        }

        if (id === doctor) {
          return set(playerRef, "doctor");
        }

        return set(playerRef, "citizen");
      });
      try {
        await Promise.all(Allpromises);
        await set(roomRef, true);
      } catch {
        event.target.disabled = false;
      }
    }
  };
  const PlayersList = players
    ? Object.keys(players).map((id) => {
        return (
          <li
            className={`w-full   bg-subBg    
        [box-shadow:0_0_5px_green] md:h-1/4
        h-2/3
        p-2
        md:p-4  rounded-2xl
        flex md:items-center
        md:justify-between
        md:flex-row
        flex-col
        ${
          players[id].isHost
            ? "outline-4 outline-amber-500 outline-offset-2"
            : players[id].id == userId
              ? "outline-4 outline-white outline-offset-2"
              : ""
        }
        `}
            key={players[id].id}
          >
            <span className="md:flex flex-col h-full">
              Name:
              <span className="text-md text-blue-500 ml-3 md:m-0">
                {players[id].username} {players[id].id == userId ? "(You)" : ""}{" "}
                {players[id].isHost ? "(Host)" : ""}
              </span>
            </span>
            <span className="md:flex flex-col h-full ">
              Email:
              <span className="text-md text-blue-500 ml-3 md:m-0">
                {players[id].email}
              </span>
            </span>
            <span className="md:flex flex-col h-full ">
              Id:
              <span className="text-md text-blue-500 ml-3 md:m-0">
                {players[id].id}
              </span>
            </span>
          </li>
        );
      })
    : null;
  return (
    <div className="w-full md:col-span-3 md:row-auto row-start-1 row-end-6 flex flex-col shadow-lg">
      <h1
        className="
        flex-col
        md:flex-row
      md:text-2xl bg-Im2/70 
      backdrop:backdrop-blur-2xl 
      text-center rounded-t-2xl 
      md:h-12 h-30 relative top-1 flex items-center justify-around
      p-1
      "
      >
        Room id: {roomId}
        <button
          className="bg-red-900 w-30 h-7 rounded-xl 
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
    h-75/100
    bg-Im1/50 backdrop:backdrop-blur-2xl
    flex 
    flex-col 
    gap-7 p-5 rounded-2xl
    rounded-t-none
    w-full
    overflow-y-auto
    overflow-x-hidden
    max-h-99
    "
      >
        {PlayersList}
      </ul>
      <div className=" flex items-center justify-center pt-1 flex-col h-25/100">
        {players && players[userId].isHost ? (
          <button
            disabled={!(players && Object.keys(players).length >= 6)}
            className={`${players && Object.keys(players).length >= 6 ? "bg-green-500 hover:scale-95 active:scale-90 transition-all duration-200" : "bg-green-700"} rounded-sm shadow-sm shadow-amber-50 h-1/2 w-1/2`}
            onClick={handleStart}
          >
            Start Game
          </button>
        ) : (
          <p>Watting for Host to start ...</p>
        )}

        <p
          className={
            players && Object.keys(players).length < 4
              ? "text-Im2"
              : players && Object.keys(players).length < 6
                ? "text-yellow-300"
                : "text-green-500"
          }
        >
          Number of players: {players && Object.keys(players).length}
        </p>
        <p>Must be at least 6 players to start the game</p>
      </div>
    </div>
  );
}
