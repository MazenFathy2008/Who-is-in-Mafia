import{ref,set,get} from "firebase/database"
import {db} from "../../../../config/firebase"
const createNewRoom =async (hostId,invitedFriends =[])=>{
  const roomId = crypto.randomUUID()
  const roomRefrence = ref(db,`rooms/${roomId}/host`)
  const hostDataRefrence = ref(db,`users/${hostId}/Profile`)
  const userData = await get(hostDataRefrence)
  console.log(userData.val())
  set(roomRefrence,{
    id:hostId,
    ...userData.val()
  })
}
export default createNewRoom; 