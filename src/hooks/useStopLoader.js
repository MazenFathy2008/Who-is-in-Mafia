import { GlobalLoaderProvider } from "../App";
import { useContext } from "react";
export default function useStopLoader() {
  const [loading,setLoading] = useContext(GlobalLoaderProvider);
  if(loading!=false){
    setLoading(false)
  }
}
