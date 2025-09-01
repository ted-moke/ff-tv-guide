import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getAuth, onAuthStateChanged, User, signOut, signInAnonymously } from "firebase/auth";
import { app } from "../../firebaseConfig";
import { AuthData } from "./authTypes";
import { API_URL } from "../../config";
import { useQueryClient } from "@tanstack/react-query";

const AuthContext = createContext<{
  user: User | null;
  isLoading: boolean;
  logout: () => Promise<void>;
  backendUser: AuthData | null;
  registerTemporaryUser: (user: User) => Promise<AuthData>;
  loginWithFirebaseUser: (user: User) => Promise<AuthData>;
}>({
  user: null,
  isLoading: true,
  logout: async () => {},
  backendUser: null,
  registerTemporaryUser: async () => ({ authenticated: false }),
  loginWithFirebaseUser: async () => ({ authenticated: false }),
});

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider2 = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [backendUser, setBackendUser] = useState<AuthData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthInitializing, setIsAuthInitializing] = useState(false);
  const queryClient = useQueryClient();

  const logout = async () => {
    const auth = getAuth(app);
    try {
      await signOut(auth);
      setBackendUser(null);
      setUser(null);
      await queryClient.removeQueries({ queryKey: ["platform-credentials"] });
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  const registerTemporaryUser = async (user: User): Promise<AuthData> => {
    console.log("registering temporary user");
    const idToken = await user.getIdToken();

    const response = await fetch(`${API_URL}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        username: `temp-${Math.random().toString(36).substring(2, 15)}`,
        isTemporary: true,
      }),
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to register user");
    const data = await response.json();

    if (!data.authenticated) {
      throw new Error("Failed to login");
    }

    setBackendUser(data);

    return data;
  };

  const loginWithFirebaseUser = useCallback(async (user: User) => {
    const idToken = await user.getIdToken();
    const response = await fetch(`${API_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      credentials: "include",
    });
    if (!response.ok || response.status !== 200) {
      console.log("failed to login, response not ok");
      throw new Error(`Failed to login, response not ok. Code: ${response.status}`);
    } 

    const data = await response.json();
    if (!data.authenticated) {
      console.log("failed to login, user not authenticated");
      throw new Error("Failed to login, user not authenticated");
    }

    if (data.error === "User not found") {
      console.log("failed to login, user not found");
      logout();
      throw new Error("Failed to login, user not found");
    }

    return data;
  }, []);

  // Base auto login flow, firebase stores user so use that to get backend user
  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (isAuthInitializing || backendUser) return;
      try {

        setUser(currentUser);
        setIsAuthInitializing(true);
        if (currentUser) {
          const backendUserData = await loginWithFirebaseUser(currentUser);
          setBackendUser(backendUserData);
        }
      } catch (error) {
        console.error("Error in auth state changed:", error);

        // If we tried an autologin and failed, register a temporary user
        if (error instanceof Error && error.message.includes("401") && currentUser) {
          console.log("401, registering temporary user");
          const backendUserData = await registerTemporaryUser(currentUser);
          setBackendUser(backendUserData);
        }
      } finally {
        setIsLoading(false);
        setIsAuthInitializing(false);
      }
    });

    return () => unsubscribe();
  }, [loginWithFirebaseUser, registerTemporaryUser, isAuthInitializing, backendUser, signInAnonymously]);


  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        logout,
        backendUser,
        registerTemporaryUser,
        loginWithFirebaseUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
