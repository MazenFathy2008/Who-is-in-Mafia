export default function FriendsList({showFriends}) {
  return (
    <>
      <h1 className="text-3xl">Your Friends</h1>
      <ul className="min-h-full w-full overflow-y-auto">{showFriends}</ul>
    </>
  );
}
