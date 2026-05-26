import { button } from "motion/react-client";

export default function Submit({page,data}){
  const handleClick=()=>{
    if(page=="Log In"){
      console.log(`Log in data ${data}`)
    }else if(page == "Register"){
      console.log(`Registering data ${data}`)
    }
  }
  return(
    <button type="button" className="
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
    "
    onClick={handleClick}
    >
      {page}
    </button>
  )
}