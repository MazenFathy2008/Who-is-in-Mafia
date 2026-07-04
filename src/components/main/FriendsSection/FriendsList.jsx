import { useOutletContext } from "react-router-dom";

export default function FriendsList() {
  const {userFriends} = useOutletContext()
  const showFriends = Object.keys(userFriends).map((friend) => {
    return <li key={userFriends[friend].id}>{userFriends[friend].name}</li>;
  });
  return (
    <>
      <h1 className="text-3xl">Your Friends</h1>
      <ul className="min-h-full w-full overflow-y-auto">{showFriends}</ul>
    </>
  );
}
