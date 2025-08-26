import { User } from "@/types/contracts";
import { useState } from "react";
import { useContext, createContext } from "react";
import { UserCreate, UserLogin } from "@/types/auth";
import * as React from "react";

type AuthState = {
  user: User | null;
  accessToken: string | null;
  apiKey: string | null;
  isLoading: boolean;
};

type AuthContextType = AuthState & {
  login: (creds: UserLogin) => Promise<void>;
  register: (payload: UserCreate) => Promise<void>;
  logout: () => Promise<void> | void;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  return (
    <AuthContext.Provider
      user={user}
      isLoading={isLoading}
      apiKey={apiKey}
      accessToken={accessToken}
    >
      {children}
    </AuthContext.Provider>
  );
}
