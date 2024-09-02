import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

const API_URL = import.meta.env.VITE_API_URL;

export const verifyToken = async () => {
  const response = await fetch(`${API_URL}/users/verify-token`, { 
    method: 'GET',
    credentials: 'include'
  });
  if (!response.ok) throw new Error('Failed to verify token');
  return response.json();
};

export const registerUser = async (userData: { username: string; email: string; password: string }) => {
  const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
  const idToken = await userCredential.user.getIdToken();

  const response = await fetch(`${API_URL}/users/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
    body: JSON.stringify({ username: userData.username, email: userData.email }),
    credentials: 'include'
  });
  if (!response.ok) throw new Error('Failed to register user');
  return response.json();
};

export const loginUser = async (credentials: { email: string; password: string }) => {
  const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
  const idToken = await userCredential.user.getIdToken();

  const response = await fetch(`${API_URL}/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
    credentials: 'include'
  });
  if (!response.ok) throw new Error('Failed to login');
  return response.json();
};