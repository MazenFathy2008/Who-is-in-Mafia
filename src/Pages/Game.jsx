import useStopLoader from "../hooks/useStopLoader";

export default function Game(){
  const stopLoader = useStopLoader()
  stopLoader()
  return(
    <p>Game</p>
  )
}