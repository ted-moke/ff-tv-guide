import { auth } from "../../firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { AuthData } from "./authTypes";

const API_URL = import.meta.env.VITE_API_URL;

// Set up auth state listener
onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log("User is signed in, grabbing new token and setting");
    const token = await user.getIdToken(true);
    localStorage.setItem("authToken", token);
  }
});

export const verifyToken = async (): Promise<AuthData> => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    console.log("No token found");
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
  const data = await response.json();

  if (!data.authenticated) {
    throw new Error("Failed to login");
  }

  return data;
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

  const data = await response.json();
  if (!data.authenticated) {
    throw new Error("Failed to login");
  }

  return data;
};
