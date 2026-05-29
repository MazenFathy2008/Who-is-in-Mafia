import { GlobalLoaderProvider } from "../App";
import { useContext } from "react";
export default function useStartLoader() {
  console.log("Loader start");
  const [loading, setLoading] = useContext(GlobalLoaderProvider);
  if (loading != true) {
    setLoading(true);
  }
}
