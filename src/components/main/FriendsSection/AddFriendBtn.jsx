import { ref, update, get } from "firebase/database";
import { db } from "../../../config/firebase";
import { useParams } from "react-router-dom";
import useStartLoader from "../../../hooks/useStartLoader";
import useStoptLoader from "../../../hooks/useStopLoader";
export default function AddFRiendBtn({
  friendId,
  clearInput,
  requestSentOn,
  sentErrMsg,
}) {
  const uid = useParams().userId;
  friendId = friendId === "" ? " " : friendId;
  const startLoader = useStartLoader();
  const stopLoader = useStoptLoader();
  const handleClike = async () => {
    startLoader();
    try {
      const Friendreference = ref(db, `users/${friendId}/Profile`);
      const Friendshot = await get(Friendreference);
      if (Friendshot.exists()) {
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
        requestSentOn();
      } else {
        sentErrMsg("This Id doesn't exsist");
      }
      clearInput();
    } catch (err) {
      console.log(err);
    }
    stopLoader();
  };
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
