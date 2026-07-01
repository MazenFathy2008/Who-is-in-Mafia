import { headerLi } from "./styles";
import UnderLineDiv from "../global/UderLineDiv";
import { motion } from "motion/react";
export default function Header({ selected, setSelected }) {
  const items = ["Play", "Friends", "Profile"];
  return (
    <header
      className="
    bg-background/50 w-full h-30
    sm:h-20
    border-Im1 border-2
    rounded-xl
    backdrop-blur-4xl
    flex
    flex-col
    sm:flex-row
    items-center
    px-5
    justify-around
    sm:justify-between
    "
    >
      <h1
        className="
      text-Im2 
      text-2xl
      sm:text-5xl 
      whitespace-nowrap cursor-pointer
      select-none
      flex
      "
      >
        Who Is In
        <img
          src="/Icons/M-icon.png"
          className="
        w-10
        ml-2
        animate-bounce
        "
        />
        afia
      </h1>
      <motion.ul
        className="
    flex
    w-full
    justify-between
      h-full
    sm:w-1/2
    relative
    "
      >
        {items.map((item) => (
          <li key={item} onClick={() => {
            setSelected(prev=>prev != item?item:prev)
            }} className={headerLi}>
            {item}
            {selected === item && (
              <UnderLineDiv
                Id={"UnderLine"}
                className={`
                absolute 
                bottom-0 
                h-2 w-1/${items.length}
                bg-Im2
                shadow-2xs
                `}
              />
            )}
          </li>
        ))}
      </motion.ul>
    </header>
  );
}
