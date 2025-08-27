import { User } from "@/types/contracts";
import { useState } from "react";
import { createContext, useEffect } from "react";
import { UserCreate, UserLogin } from "@/types/auth";
import * as React from "react";
import { loginUser, createUser, getUser, removeTokens } from "@/services/auth";

type AuthState = {
  user: User | null;
  isLoading: boolean;
};

type AuthContextType = AuthState & {
  login: (creds: UserLogin) => Promise<void>;
  createUser: (payload: UserCreate) => Promise<void>;
  logout: () => Promise<void> | void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  async function login(credentials: UserLogin) {
    setIsLoading(true);
    const loginResult = await loginUser(credentials);
    if (loginResult.success) {
      setUser(loginResult.user);
    } else {
      setUser(null);
    }
    setIsLoading(false);
  }

  async function logout() {
    removeTokens();
    setUser(null);
  }

  useEffect(() => {
    async function initAuth() {
      setIsLoading(true);
      try {
        const user = await getUser();
        if (user) {
          setUser(user);
        } else {
          window.location.href = "/login";
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        setUser(null);
      }
      setIsLoading(false);
    }

    initAuth();
  }, []);

  return (
    <AuthContext.Provider
      user={user}
      isLoading={isLoading}
      logout={logout}
      login={login}
      createUser={createUser}
    >
      {children}
    </AuthContext.Provider>
  );
}
