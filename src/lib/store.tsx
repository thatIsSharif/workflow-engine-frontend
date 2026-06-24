"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { User } from "./types";

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("selected_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("selected_user");
      }
    }
  }, []);

  const handleSetUser = (u: User | null) => {
    setUser(u);
    if (u) {
      localStorage.setItem("selected_user", JSON.stringify(u));
    } else {
      localStorage.removeItem("selected_user");
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser: handleSetUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
