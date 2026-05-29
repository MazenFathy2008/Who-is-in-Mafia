import { GlobalLoaderProvider } from "../App";
import { useContext} from "react";
export default function useStartLoader() {
  const setLoading = useContext(GlobalLoaderProvider);
  return ()=>{setLoading(true)}
}
