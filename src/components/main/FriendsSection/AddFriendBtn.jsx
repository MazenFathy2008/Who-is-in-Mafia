export default function AddFRiendBtn({
  handleClike
}) {  
  return (
    <button
      onClick={handleClike}
      className="
    border-2
    w-full
    md:w-1/3
    h-16
    rounded-md cursor-pointer
    shadow-sm
    bg-font
    text-background
    shadow-font
  hover:scale-105
  transtion
  duration-200
  active:scale-110
    "
    >
      Search for friend
    </button>
  );
}
