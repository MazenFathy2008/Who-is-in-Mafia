import { useParams } from "react-router-dom";

export default function AddMethod(){
  const {addMethod} = useParams()
  return(
    "this is the method"+" " + addMethod
  )
}