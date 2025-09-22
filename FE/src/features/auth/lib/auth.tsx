import { createContext, useContext, useMemo, useState, ReactNode, useCallback } from "react";

export type AuthContextValue = {
  isLoggedIn: boolean;
  userName?: string;
  userAvatar?: string;
  login: (opts?: { userName?: string; userAvatar?: string }) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | undefined>(undefined);
  const [userAvatar, setUserAvatar] = useState<string | undefined>(undefined);

  const login = useCallback((opts?: { userName?: string; userAvatar?: string }) => {
    setIsLoggedIn(true);
    if (opts?.userName !== undefined) setUserName(opts.userName);
    if (opts?.userAvatar !== undefined) setUserAvatar(opts.userAvatar);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUserName(undefined);
    setUserAvatar(undefined);
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    isLoggedIn,
    userName,
    userAvatar,
    login,
    logout,
  }), [isLoggedIn, userName, userAvatar, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};


