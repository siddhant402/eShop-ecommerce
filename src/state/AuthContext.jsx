import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const value = useMemo(
    () => ({
      token,
      isLoggedIn: Boolean(token),
      signIn: (t) => {
        localStorage.setItem("token", t);
        setToken(t);
      },
      signOut: () => {
        localStorage.removeItem("token");
        setToken(null);
      },
    }),
    [token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
