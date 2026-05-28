import { motion } from "motion/react";
import {
  labelStyles,
  containerStyles,
  inputStyles,
  buttonStyles,
} from "./styles";
import Submit from "./submit";
import { useState } from "react";
import { use } from "motion/react-m";
export default function LogIn({ setErrors, flipped, time, setFlipped }) {
  const [showPassword, setPasswordState] = useState(false);
  const [data, setData] = useState({
    emailLog: "",
    passwordLog: "",
  });
  const handleClick = () => {
    setPasswordState((prev) => !prev);
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setData((prev) => {
      return {
        ...prev,
        [name]: value.replace(/\s/g, ""),
      };
    });
  };
  return (
    <motion.div
      animate={{
        opacity: flipped ? 0 : 1,
        y: flipped ? 100 : 0,
        pointerEvents: flipped ? "none" : "auto",
      }}
      transition={{
        duration: time,
      }}
      className="
      absolute 
      inset-0 
      p-5
      sm:p-7
      flex
      flex-col
      items-center
      gap-20
      sm:gap-15
      justify-between
      "
    >
      <h2 className="text-2xl">Please Log In</h2>
      <div className={containerStyles}>
        <input
          type="text"
          name="emailLog"
          id="emailLog"
          autoComplete="off"
          className={inputStyles}
          placeholder=""
          onChange={handleChange}
          value={data.emailLog}
        />
        <label htmlFor="emailLog" className={labelStyles}>
          Enter Your Email
        </label>
      </div>

      <div className={containerStyles}>
        <input
          type={showPassword ? "text" : "password"}
          name="passwordLog"
          id="passwordLog"
          className={inputStyles}
          placeholder=""
          onChange={handleChange}
          value={data.passwordLog}
        />
        <label htmlFor="passwordLog" className={labelStyles}>
          Enter Your Password
        </label>
        <img
          src={showPassword ? "/Icons/hide.png" : "/Icons/show.png"}
          onClick={handleClick}
          className="w-7 absolute top-1/2 -translate-y-1/2 right-3"
        />
      </div>
      <Submit page="Log In" data={data} setErrors={setErrors} />
      <button
        className={buttonStyles}
        onClick={() => {
          setData({
            emailLog: "",
            passwordLog: "",
          });
          setFlipped((prev) => !prev);
        }}
        type="button"
      >
        Don't have An account? Register
      </button>
    </motion.div>
  );
}
