import { Outlet } from "react-router-dom";
import useStopLoader from "../hooks/useStopLoader";
import { useEffect } from "react";

export default function Game() {
  const stopLoader = useStopLoader();
  useEffect(() => {
    stopLoader();
  }, []);
  return <Outlet />;
}
