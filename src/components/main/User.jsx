import {Outlet,useOutletContext} from "react-router-dom"
export default function User (){
  const userData = useOutletContext()
  return(
      <Outlet context={userData}/>
  )
}