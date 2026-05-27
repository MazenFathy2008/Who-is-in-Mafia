import {checkEmail,checkPassword,checkUserName} from "../../auth/dataValidation"
export default function Submit({ setErrors, page, data }) {
  const handleClick = () => {
    const email = data.emailLog || data.emailRegs || "";
    const password = data.passwordLog || data.passwordRegs || "";
    const userName = data.userName || "";
    const id = Date.now();
    const throwError = (msg) => {
      setErrors((prev) => {
        return [
          {
            id: id,
            msg: msg,
          },
          ...prev,
        ];
      });
      setTimeout(() => {
        setErrors((prev) => prev.filter((e) => e.id !== id));
      }, 5000);
    };
    if (!checkEmail(email)) {
      throwError("This is an invalid Email pleas Enter A valid one")
    }else if(!checkPassword(password)){
      throwError("This is a weak password")

    }
    else if (page == "Register") {
      if(!checkUserName(userName)){
        throwError("This is an invalid username")
      }
    }
    else if(page == "Log In") {}
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
