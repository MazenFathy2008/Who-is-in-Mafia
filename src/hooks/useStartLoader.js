import { GlobalLoaderProvider } from "../App";
import { useContext } from "react";
export default function useStopLoader() {
  const setLoading = useContext(GlobalLoaderProvider);
  setLoading(true);
}
