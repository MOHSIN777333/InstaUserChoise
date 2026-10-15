import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export function useUserContext() {
  return useContext(AuthContext);
}
