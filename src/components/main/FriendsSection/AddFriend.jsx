import {useOutletContext} from "react-router-dom"
export default function AddFreind() {
  const {back} = useOutletContext()
  return (
    <div className="w-full h-full z-100">
      <button
        className="
      underline
      text transition
      duration-200
      hover:scale-110
      active:scale-95
      text-2xl
      hover:[text-shadow:1px_1px_5px_white]
      "
        onClick={()=>{
          back()
        }}
      >
        back
      </button>
      <ul className="flex w-full h-10 justify-around items-center relative">
        
      </ul>
    </div>
  );
}
