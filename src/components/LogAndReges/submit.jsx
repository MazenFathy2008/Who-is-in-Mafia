import { useNavigate } from "react-router-dom";
import {
  checkEmail,
  checkPassword,
  checkUserName,
} from "../../auth/dataValidation";
import handleRegs from "../../auth/handleRegs";
import useHandleLogin from "../../auth/handleogin";
export default function Submit({ setErrors, page, data }) {
  const navigate = useNavigate()
  const throwError = (msg) => {
    const id = Date.now();
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
  const handleClick = () => {
    const email = data.emailLog || data.emailRegs || "";
    const password = data.passwordLog || data.passwordRegs || "";
    const userName = data.userName || "";
    if (!checkEmail(email)) {
      throwError("This is an invalid Email format please Enter A valid one");
    } else if (!checkPassword(password)) {
      throwError("This is a weak password");
    } else if (page == "Register") {
      if (!checkUserName(userName)) {
        throwError("This is an invalid username");
      } else {
        handleRegs(email, password,userName, throwError,navigate);
      }
    } else if (page == "Log In") {
      useHandleLogin(email, password, throwError,navigate);
    }
  };
  return (
    <button
      type="button"
      className="
    border-2
    w-1/3
    h-16
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
