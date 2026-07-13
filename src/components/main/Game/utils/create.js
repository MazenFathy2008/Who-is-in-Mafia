import { ref, set, get } from "firebase/database";
import { db } from "../../../../config/firebase";
const createNewRoom = async (hostId, invitedFriends = {}) => {
  const roomId = crypto.randomUUID();
  const roomRefrence = ref(db, `rooms/${roomId}/`);
  const hostDataRefrence = ref(db, `users/${hostId}/Profile`);
  const userData = await get(hostDataRefrence);
  const invetationsRef = ref(db,`rooms/${roomId}/invetations`)
  set(roomRefrence, {
    host: { id: hostId, ...userData.val() },
    players: {
      [hostId]: { id: hostId,isHost:true, ...userData.val(), },
    },
  });
  set(invetationsRef,{
    ...invitedFriends
  })
};
export default createNewRoom;
