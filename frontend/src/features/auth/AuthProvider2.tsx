import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getAuth, onAuthStateChanged, User, signOut } from "firebase/auth";
import { app } from "../../firebaseConfig"; // Your Firebase client config
import { AuthData } from "./authTypes";
import { API_URL } from "../../config";

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

  const logout = async () => {
    const auth = getAuth(app);
    try {
      await signOut(auth);
      setBackendUser(null);
      setUser(null);
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
    if (!response.ok) throw new Error("Failed to login");

    const data = await response.json();
    if (!data.authenticated) {
      throw new Error("Failed to login");
    }

    return data;
  }, []);

  // Base auto login flow, firebase stores user so use that to get backend user
  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const backendUserData = await loginWithFirebaseUser(currentUser);
        setBackendUser(backendUserData);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [loginWithFirebaseUser]);


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
