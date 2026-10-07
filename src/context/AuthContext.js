import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../utlis/customAPI";

const AuthContext = createContext(null);

const readStoredUser = () => {
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [ready, setReady] = useState(!localStorage.getItem("token"));

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return undefined;

    let active = true;
    api
      .get("/auth/me")
      .then((response) => {
        if (!active) return;
        localStorage.setItem("user", JSON.stringify(response.data.data));
        setUser(response.data.data);
      })
      .catch(() => {
        if (!active) return;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      })
      .finally(() => {
        if (active) setReady(true);
      });

    return () => {
      active = false;
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      ready,
      login(nextUser, token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(nextUser));
        setUser(nextUser);
        setReady(true);
      },
      logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      },
    }),
    [user, ready]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
