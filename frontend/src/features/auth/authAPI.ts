import { auth } from "../../firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { AuthData } from "./authTypes";

const API_URL = import.meta.env.VITE_API_URL;

let currentToken: string | null = null;

// Set up auth state listener
onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentToken = await user.getIdToken(true);  // Force token refresh
    localStorage.setItem("authToken", currentToken);
  } else {
    currentToken = null;
    localStorage.removeItem("authToken");
  }
});

export const verifyToken = async (): Promise<AuthData> => {
  const token = currentToken || localStorage.getItem("authToken");

  if (!token) {
    return { authenticated: false };
  }

  try {
    const response = await fetch(`${API_URL}/users/verify-token`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    if (!response.ok) throw new Error("Failed to verify token");
    return response.json();
  } catch (error) {
    console.error("Error verifying token:", error);
    return { authenticated: false };
  }
};

export const registerUser = async (userData: {
  username: string;
  email: string;
  password: string;
}) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    userData.email,
    userData.password
  );
  const idToken = await userCredential.user.getIdToken();

  const response = await fetch(`${API_URL}/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({
      username: userData.username,
      email: userData.email,
    }),
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to register user");
  return response.json();
};

export const loginUser = async (credentials: {
  email: string;
  password: string;
}) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    credentials.email,
    credentials.password
  );
  const idToken = await userCredential.user.getIdToken();

  const response = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to login");
  return response.json();
};
