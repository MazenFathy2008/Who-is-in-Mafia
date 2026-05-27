import { motion } from "motion/react";
import { useState } from "react";
import Submit from "./submit";
import {
  labelStyles,
  inputStyles,
  containerStyles,
  buttonStyles,
} from "./styles";
export default function Register({ setErrors,flipped, time, setFlipped }) {
  const [showPassword, setPasswordState] = useState(false);
  const [data, setData] = useState({
    emailRegs:"",
    passwordRegs:"",
    userName:""
  });
  const handleChange = (event) => {
    const { name, value } = event.target;
    setData((prev) => {
      return {
        ...prev,
        [name]: value.replace(/\s/g, ""),
      };
    });
  };
  const handleClick = () => {
    setPasswordState((prev) => !prev);
  };
  return (
    <motion.div
      initial={{
        rotateY: 180,
      }}
      animate={{
        opacity: !flipped ? 0 : 1,
        y: !flipped ? 100 : 0,
        pointerEvents: !flipped ? "none" : "auto",
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
    gap-14
    sm:gap-10
    "
    >
      <h2 className="text-2xl text-center">Please Register</h2>
      <div className={containerStyles}>
        <input
          type="text"
          name="emailRegs"
          id="emailRegs"
          autoComplete={false}
          className={inputStyles}
          placeholder=" "
          onChange={handleChange}
          value={data.emailRegs}
        />
        <label htmlFor="emailRegs" className={labelStyles}>
          Enter Your Email
        </label>
      </div>
      <div className={containerStyles}>
        <input
          type="text"
          name="userName"
          id="userNameRegs"
          autoComplete={false}
          className={inputStyles}
          placeholder=" "
          onChange={handleChange}
          value={data.userName}

        />
        <label htmlFor="userNameRegs" className={labelStyles}>
          Enter Your Username
        </label>
      </div>
      <div className={containerStyles}>
        <input
          type={showPassword ? "text" : "password"}
          name="passwordRegs"
          id="passwordRegs"
          className={inputStyles}
          onChange={handleChange}
          placeholder=" "
          value={data.passwordRegs}

        />
        <img
          src={showPassword ? "/Icons/hide.png" : "/Icons/show.png"}
          onClick={handleClick}
          className="w-7 absolute top-1/2 -translate-y-1/2 right-3"
        />
        <label htmlFor="passwordRegs" className={labelStyles}>
          Enter Your Password
        </label>
      </div>
      <Submit page="Register" data={data} setErrors={setErrors}/>
      <button
        className={buttonStyles}
        onClick={() => {
          setData(()=>{return {}})
          setFlipped((prev) => !prev);
        }}
        type="button"
      >
        Already have an account? Log In
      </button>
    </motion.div>
  );
}
