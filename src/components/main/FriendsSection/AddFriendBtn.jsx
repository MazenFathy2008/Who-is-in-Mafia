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
        requestSentOn();
      }
      clearInput();
    } catch (err) {
      console.error(err);
    } finally {
      stopLoader();
    }
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
