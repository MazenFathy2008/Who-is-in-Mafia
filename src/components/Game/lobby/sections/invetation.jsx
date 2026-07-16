import GameFriendsList from "../../../global/GameFriendsList";
import { buttonStyles } from "../../../main/styles";
import { disabledButtonstyles } from "../../../main/styles";
import { useState } from "react";
import { ref, set, get } from "firebase/database";
import { db } from "../../../../config/firebase";
import { useParams } from "react-router-dom";

export default function Invitations() {
  const [invitedFriends, setInvitedFriends] = useState(null);
  const { roomId, userId } = useParams();

  const handleInvite = async () => {
    if (invitedFriends) {
      const invetationsRef = ref(db, `rooms/${roomId}/invetations`);
      const senderDataRefrence = ref(db, `users/${userId}/Profile`);
      const userData = await get(senderDataRefrence);
      set(invetationsRef, {
        ...invitedFriends,
      });
      Object.keys(invitedFriends).forEach(async (friend) => {
        const friendRef = ref(
          db,
          `users/${invitedFriends[friend].id}/Play/invetations/${roomId}/`,
        );
        await set(friendRef, {
          roomId: roomId,
          senderData: {
            id: userId,
            ...userData.val(),
          },
        });
      });
    }
  };
  return (
    <div className="grid row-span-4 md:grid-rows-6 md:row-auto gap-2 w-full">
      <GameFriendsList
        setInvitedFriends={setInvitedFriends}
        buttonStyles={buttonStyles}
        disabledButtonstyles={disabledButtonstyles}
        isInlobby={true}
      />
      <button className={buttonStyles + "row-span-1"} onClick={handleInvite}>
        Send all requests
      </button>
    </div>
  );
}
