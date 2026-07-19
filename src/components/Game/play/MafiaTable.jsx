import { useEffect, useState } from "react";

export default function MafiaTable() {
  const [players, setPlayers] = useState([1, 2, 3, 4, 5, 6]);
  const [radius, setRadius] = useState(0);
  useEffect(() => {
    const updateRadius = () => {
      setRadius(Math.min(window.innerWidth, window.innerHeight) * 0.35);
    };

    updateRadius();

    window.addEventListener("resize", updateRadius);

    return () => {
      window.removeEventListener("resize", updateRadius);
    };
  }, []);
  const listOfPlayers = players.map((id, index) => {
    const angle = (2 * Math.PI * index) / players.length;
    const x = Math.cos(angle) * (radius);
    const y = Math.sin(angle) * (radius);
    return (
      <li
        key={id}
        style={{
          left: `calc(50% + ${x}px)`,
          top: `calc(50% + ${y}px)`,
        }}
        className="absolute
                w-30
                h-20
                bg-green-500
                -translate-x-1/2
                -translate-y-1/2"
      >
        {id}
      </li>
    );
  });
  return (
    <main className="w-full h-full flex items-center justify-center">
      <ul
        style={{
          width: 2*radius,
          height: 2*radius,
        }}
        className={` rounded-[50%] bg-amber-800`}
      >
        {listOfPlayers}
      </ul>
    </main>
  );
}
