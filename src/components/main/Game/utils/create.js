import { ref, set, get } from "firebase/database";
import { db } from "../../../../config/firebase";
const createNewRoom = async (hostId, invitedFriends = {}) => {
  const roomId = crypto.randomUUID();
  const roomRefrence = ref(db, `rooms/${roomId}/`);
  const hostDataRefrence = ref(db, `users/${hostId}/Profile`);
  const userData = await get(hostDataRefrence);
  const invetationsRef = ref(db, `rooms/${roomId}/invetations`);
  const isInCurrentRoom = ref(db, `users/${hostId}/Play/currentRoom`);
  await set(roomRefrence, {
    host: { id: hostId, ...userData.val() },
    players: {
      [hostId]: { id: hostId, isHost: true, ...userData.val() },
    },
  });
  await set(invetationsRef, {
    ...invitedFriends,
  });
  await set(isInCurrentRoom, roomId);

  Object.keys(invitedFriends).forEach(async (friend) => {
    const friendRef = ref(
      db,
      `users/${invitedFriends[friend].id}/Play/invetations/${roomId}/`,
    );
    await set(friendRef, {
      roomId: roomId,
      senderData: {
        id: hostId,
        ...userData.val(),
      },
    });
  });
};
export default createNewRoom;
