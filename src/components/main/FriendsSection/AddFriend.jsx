import { motion } from "motion/react";
import { useState } from "react";
import UderLineDiv from "../../global/UderLineDiv";
export default function AddFreind() {
  const searchWith = ["Add using username", "Add using Id"];
  const [currentSelected, setCurrentSelected] = useState(searchWith[0]);
  return (
    <div className="w-full h-full z-100 ">
      <motion.ul className="flex w-full h-10 justify-around items-center relative">
        {searchWith.map((searchType, i) => {
          return (
            <>
              <li key={i} 
              className="flex-1 flex flex-col cursor-pointer items-center justify-center"
              onClick={()=>{setCurrentSelected(searchType)}}
              >
                {searchType}
                {searchType == currentSelected ? (
                  <UderLineDiv
                    Id={"UderLineAdd"}
                    className={`absolute bg-Im2 h-2 bottom-0 w-1/${searchWith.length}`}
                  />
                ) : null}
              </li>
  
            </>
          );
        })}
      </motion.ul>
    </div>
  );
}
