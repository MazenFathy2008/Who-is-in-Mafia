import { button } from "motion/react-client";

export default function Submit({page}){
  return(
    <button type="submit" className="
    border-2
    w-1/3
    h-full
    rounded-md cursor-pointer
    shadow-sm
  bg-font
  text-background
  shadow-font
  hover:scale-105
  transtion
  duration-200
  active:scale-120
    ">
      {page}
    </button>
  )
}