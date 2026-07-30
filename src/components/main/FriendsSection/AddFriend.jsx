import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import AddFriendBtn from "./AddFriendBtn.jsx";
import SucceedMsg from "./SucceedMsg .jsx";
import acceptRequest from "./utils/acceptReqeust";
import useStartLoader from "../../../hooks/useStartLoader";
import useStoptLoader from "../../../hooks/useStopLoader";
import ErrMsg from "./ErrorMsg.jsx";
import { ref, update, get } from "firebase/database";
import { db } from "../../../config/firebase";
import { useParams } from "react-router-dom";
export default function AddFreind() {
  const { back } = useOutletContext();
  const [id, setId] = useState("");
  const [succeedMsg, setSucceedMsg] = useState(false);
  const [errMsg, setErrMsg] = useState(false);
  const uid = useParams().userId;
  const startLoader = useStartLoader();
  const stopLoader = useStoptLoader();
  const handleClick = async () => {
    const friendId = id;
    startLoader();
    try {
      const Friendreference = ref(db, `users/${friendId}/Profile`);
      const Friendshot = await get(Friendreference);
      const isFriendRef = ref(db, `users/${uid}/Friends/${friendId}`);
      const isFriend = (await get(isFriendRef)).exists();
      const isInMySentRequestsRef = ref(
        db,
        `users/${uid}/sentRequests/${friendId}`,
      );
      const isInFriendRequestsRef = ref(
        db,
        `users/${friendId}/requests/${uid}`,
      );
      const isInMySentRequest = (await get(isInMySentRequestsRef)).exists();
      const isInFriendRequests = (await get(isInFriendRequestsRef)).exists();
      // check if your friend already sent request first
      const isInMyRequestsRef = ref(db, `users/${uid}/requests/${friendId}`);
      const isInFriendSentRequestsRef = ref(
        db,
        `users/${friendId}/sentRequests/${uid}`,
      );
      const isInMyRequests = (await get(isInMyRequestsRef)).exists();
      const isInFriendSentRequests = (
        await get(isInFriendSentRequestsRef)
      ).exists();
      if (friendId === uid) {
        sentErrMsg(
          "Do you want to sent a friend request for your self, Poor you 😢",
        );
      } else if (isFriend) {
        sentErrMsg("This is already a friend");
      } else if (!Friendshot.exists()) {
        sentErrMsg("This Id doesn't exsist");
      } else if (isInFriendRequests && isInMySentRequest) {
        sentErrMsg("This request is already sent");
      } else if (isInMyRequests && isInFriendSentRequests) {
        acceptRequest(uid, friendId);
        funcSucceedMsg(
          "We found that your friend has already sent a friend request to you so we accept it",
        );
      } else {
        const myRequests = ref(db, `users/${uid}/sentRequests`);
        const friendrequests = ref(db, `users/${friendId}/requests`);
        await update(myRequests, {
          [friendId]: {
            ...Friendshot.val(),
          },
        });
        const myData = await get(ref(db, `users/${uid}/Profile`));
        await update(friendrequests, {
          [uid]: {
            ...myData.val(),
          },
        });
        funcSucceedMsg("request has been sent !");
      }
      clearInput();
    } catch (err) {
      console.error(err);
    } finally {
      stopLoader();
    }
  };
  const clearInput = () => {
    setId("");
  };
  useEffect(() => {
    if (!succeedMsg) return;
    const timeout = setTimeout(() => {
      setSucceedMsg(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [succeedMsg]);
  const funcSucceedMsg = (msg) => {
    setSucceedMsg(msg);
  };
  const sentErrMsg = (msg) => {
    setErrMsg(msg);
  };
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
        {succeedMsg ? <SucceedMsg msg={succeedMsg} /> : null}
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
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleClick();
              }
            }}
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
        <AddFriendBtn handleClike={handleClick} />
      </div>
    </div>
  );
}
