import { GlobalLoaderProvider } from "../App";
import { useContext, useEffect } from "react";
export default function useStopLoader() {
  const [loading, setLoading] = useContext(GlobalLoaderProvider);
  useEffect(() => {
    if (loading != false) {
      setLoading(false);
    }
  }, []);
}
