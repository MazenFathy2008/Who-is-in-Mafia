import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import AddFriendBtn from "./AddFriendBtn.jsx";
import RequestSent from "./requestSent.jsx";
import ErrMsg from "./ErrorMsg.jsx";
export default function AddFreind() {
  const { back } = useOutletContext();
  const [id, setId] = useState("");
  const [requestSent, setRequestSent] = useState(false);
  const [errMsg, setErrMsg] = useState(false);
  const clearInput = () => {
    setId("");
  };
  useEffect(() => {
    if (!requestSent) return;
    const timeout = setTimeout(() => {
      setRequestSent(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [requestSent]);
  const requestSentOn = () => {
    setRequestSent(true);
  };
  const sentErrMsg = (msg)=>{
    setErrMsg(msg);
  }
  useEffect(() => {
    const timeout = setTimeout(() => {
      setErrMsg(false);
    }, 3000);
    return () => clearTimeout(timeout);
  }, [errMsg]);
  const handleChange = (event) => {
    setId(event.target.value.replace(/[^\p{L}\p{N}]/gu, ""));
  };
  return (
    <div
      className="
    w-full 
    h-full 
    z-100 
    relative
    "
    >
      <AnimatePresence>
        {requestSent ? <RequestSent /> : null}
        {errMsg ? <ErrMsg msg={errMsg} /> : null}
      </AnimatePresence>
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
        onClick={() => {
          back();
        }}
      >
        back
      </button>
      <h1 className="md:text-5xl text-2xl absolute top-2 left-1/2 -translate-x-1/2">
        Add Friends
      </h1>
      <div className="absolute top-20 md:top-30 bottom-0 w-full flex md:items-center justify-around flex-col">
        <div className="relative flex w-full items-center justify-center h-fit">
          <input
            type="text"
            name="AddWithId"
            id="AddWithId"
            autoComplete="off"
            value={id}
            onChange={handleChange}
            className={`
              border-3
        border-Im1
        focus:border-Im2
        transtion
        duration-200
        w-full
        md:w-1/2
        outline-0
        p-2
        box-border
        rounded-2xl
        peer
        `}
            placeholder=""
          />

          <label
            htmlFor="AddWithId"
            className={`
              absolute
              z-100
              select-none
          top-1/2
          -translate-y-1/2
          left-4
          md:left-1/2
          md:-translate-x-1/2
          text-font
          opacity-50
          transition-all
          duration-200
          peer-focus:opacity-100
          peer-focus:-top-5
          peer-focus:left-5
          md:peer-focus:left-1/2
          peer-focus:sm:left-10 
          peer-focus:scale-125
          peer-focus:sm:scale-150
          peer-not-placeholder-shown:opacity-100
          peer-not-placeholder-shown:-top-5
          peer-not-placeholder-shown:left-5
          md:peer-not-placeholder-shown:left-1/2
          peer-not-placeholder-shown:sm:left-10 
          peer-not-placeholder-shown:scale-125 
          peer-not-placeholder-shown:sm:scale-150
  `}
          >
            Enter Your Friend Id
          </label>
        </div>
        <AddFriendBtn
          friendId={id}
          clearInput={clearInput}
          requestSentOn={requestSentOn}
          sentErrMsg ={sentErrMsg}
        />
      </div>
    </div>
  );
}
