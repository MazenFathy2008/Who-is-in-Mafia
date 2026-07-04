import { update, ref,remove,get } from "firebase/database";
import { db } from "../../../../config/firebase";
export default async function acceptRequest(uid, friendId) {
  // get data
  const myProfileRef = ref(db,`users/${uid}/Profile`)
  const friendProfileRef = ref(db,`users/${friendId}/Profile`)
  const myShot = (await get(myProfileRef)).val()
  const friendShot = (await get(friendProfileRef)).val()

  //Add to friend
  const MyFriendsListRef = ref(db,`users/${uid}/Friends/${friendId}`)
  const FriendFriendsListRef = ref(db,`users/${friendId}/Friends/${uid}`)
  await update(MyFriendsListRef,friendShot)
  await update(FriendFriendsListRef,myShot)
  //clear requests
  const MyRequestsRef = ref(db, `users/${uid}/requests/${friendId}`);
  const FriendSentRequestsRef = ref(
    db,
    `users/${friendId}/sentRequests/${uid}`,
  );
  await remove(MyRequestsRef)
  await remove(FriendSentRequestsRef)
}
