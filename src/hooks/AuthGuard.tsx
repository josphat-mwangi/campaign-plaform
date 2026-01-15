import { CircularLoader } from "ochom-react-components";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import axios from "../services/api";
import type { AdminUser } from "../types";

type AuthContextType = {
  user: AdminUser | null;
  signOut?: () => void;
};

const AuthContext = createContext({} as AuthContextType);

export const useAuth = () => {
  return useContext(AuthContext);
};

interface AuthGuardProps {
  children: ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [state, setState] = useState<AuthContextType>({
    user: null,
  });

  const setAuthenticated = (user: AdminUser, token: string) => {
    sessionStorage.setItem("authToken", token);
    setState((prev) => ({ ...prev, user }));
  };

  const clearAuthState = () => {
    sessionStorage.removeItem("authToken");
    setState({ user: null });
  };

  const handleSignout = () => {
    clearAuthState();
  };

  // after 5 seconds, if the user is still null, set loading to false
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!currentUser || loading) {
        setLoading(false);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!currentUser) {
      console.log("No user authenticated, redirecting to login");
      return;
    }

    const loadUser = async () => {
      axios
        .get(`/auth/load-user?uid=${currentUser?.id}`)
        .then(({ data }) => {
          const { user, access_token } = data;
          setAuthenticated(user, access_token);
        })
        .catch((err) => {
          console.error("Error loading user:", err);
          clearAuthState();
        })
        .finally(() => {
          setLoading(false);
        });
    };

    loadUser();
  }, [currentUser]);

  const values = {
    ...state,
    signOut: handleSignout,
  };

  if (loading) {
    return <CircularLoader />;
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};
