import { ref, set, get, onValue } from "firebase/database";
import { db } from "../../../../config/firebase";
export const kill = async (roomId, playerId) => {
  const mafiaTargetRef = ref(db, `rooms/${roomId}/mafiaTarget`);
  await set(mafiaTargetRef, playerId);
};
export const heal = async (roomId, playerId) => {
  const doctorTargetRef = ref(db, `rooms/${roomId}/doctorTarget`);
  await set(doctorTargetRef, playerId);
};
export const vote = async (roomId, myId, playerId) => {
  const votesRef = ref(db, `rooms/${roomId}/votes`);
  const myRef = ref(db, `rooms/${roomId}/players/${myId}/voted`);
  const snapshot = await get(votesRef);
  const currentVotes = snapshot.val() || {};
  const votedOn = {
    ...(currentVotes.votedOn || {}),
  };
  votedOn[playerId] = (votedOn[playerId] || 0) + 1;
  const sum = (currentVotes.sum || 0) + 1;
  await set(votesRef, {
    votedOn,
    sum,
  });
  await set(myRef, true);
};
export const getTarget = (roomId, setTarget) => {
  let data;
  const TargetRef = ref(db, `rooms/${roomId}/reveal-target`);
  const unsub = onValue(TargetRef, (snapshot) => {
    if (snapshot.val()) {
      setTarget(snapshot.val());
    }
  });
  return unsub
};
