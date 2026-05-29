import { GlobalLoaderProvider } from "../App";
import { useContext, useEffect } from "react";
export default function useStartLoader() {
  console.log("Loader start");
  const [loading, setLoading] = useContext(GlobalLoaderProvider);
  useEffect(() => {
    if (loading != true) {
      setLoading(true);
    }
  }, []);
}
