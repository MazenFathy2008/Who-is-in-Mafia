import { useOutletContext } from "react-router-dom";
import { useState } from "react";
import { buttonStyles } from "./styles";
import AddFriend from "./FriendsSection/AddFriend";
import FriendsList from "./FriendsSection/FriendsList"
export default function Friends() {
  const userFriends = useOutletContext() || {};
  const [isAddFriend, setIsAddFriend] = useState(false);
  const [isShowRequests, setIsShowRequests] = useState(false);

  const showFriends = Object.keys(userFriends).map((key) => {
    return <li key={userFriends[key].id}>{userFriends[key].name}</li>;
  });
  return (
    <section
      className="
    w-full
    h-full
    flex
    flex-col
    py-15 
    px-5 
    "
    >
      <div className="flex-1 flex items-center gap-20">
        <button
          onClick={() => {
            setIsAddFriend(true);
          }}
          className={buttonStyles + `px-0.5 h-1/2 w-full`}
        >
          Add Friends
        </button>
        <button className={buttonStyles + `px-0.5 h-1/2 w-full`}>
          Requests
        </button>
      </div>
      <div
        className="
      flex-3
      shadow-md
    shadow-black
      w-full
      h-full
    bg-subBg/70 backdrop-blur-lg
    border-4
    border-Im1
    rounded-3xl
    max-h-137.5
    flex
    flex-col
    justify-between
    items-center
    p-5
    overflow-hidden
    
      "
      >
        {isAddFriend && !isShowRequests ? (
          <AddFriend />
        ) : isShowRequests && !isAddFriend ? (
          "current requests"
        ) : (
          <FriendsList showFriends={showFriends}/>
        )}
      </div>
    </section>
  );
}
