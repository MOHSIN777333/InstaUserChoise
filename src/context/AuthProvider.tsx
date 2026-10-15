import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { useEffect, useState } from "react";
import { getCurrentAccount } from "@/lib/appwrite/api";
import type { IUser } from "@/types";
import { INITIAL_USER } from "./AuthContext";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const checkAuthUser = async (): Promise<boolean> => {
    setIsLoading(true);

    try {
      const currentAccount = await getCurrentAccount();

      if (!currentAccount) {
        setUser(INITIAL_USER);
        setIsAuthenticated(false);
        return false;
      }
      console.log("currentAccount context,", currentAccount);

      setUser({
        id: currentAccount.$id,
        name: currentAccount.name,
        username: currentAccount.username,
        email: currentAccount.email,
        imageUrl: currentAccount.imageUrl,
        bio: currentAccount.bio,
      });

      setIsAuthenticated(true);

      return true;
    } catch (error) {
      console.error("Authentication error:", error);

      setUser(INITIAL_USER);
      setIsAuthenticated(false);

      return false;
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    console.log("run, useeffect");

    const cookieFallback = localStorage.getItem("cookieFallback");
    if (cookieFallback === "[]") {
      navigate("/sign-in");
    }

    checkAuthUser();
  }, []);

  const value = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
