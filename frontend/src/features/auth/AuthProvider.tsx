import React, { createContext, useContext, ReactNode } from "react";
import { useAuth } from "./useAuth";
import { AuthData } from "./authTypes";

interface AuthContextType {
  user: AuthData | null;
  isLoading: boolean;
  error: Error | null;
  login: ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => Promise<AuthData>;
  register: ({
    email,
    password,
    username,
    isTemporary,
  }: {
    email: string;
    password: string;
    username: string;
    isTemporary: boolean;
  }) => Promise<AuthData>;
  registerTemporaryUser: () => Promise<AuthData>;
  convertTempUser: (userData: {
    id: string;
    email: string;
    username: string;
    password: string;
  }) => Promise<AuthData>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
