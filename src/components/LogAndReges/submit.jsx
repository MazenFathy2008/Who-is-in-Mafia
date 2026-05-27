export default function Submit({ setErrors, page, data }) {
  const handleClick = () => {
    const id = Date.now();
    setErrors((prev) => {
      return [
        {
          id: id,
          msg: "New error",
        },
        ...prev,
      ];
    });
    setTimeout(() => {
      setErrors((prev) => prev.filter((e) => e.id !== id));
    }, 5000);
  };
  return (
    <button
      type="button"
      className="
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
  );
}
