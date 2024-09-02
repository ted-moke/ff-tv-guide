import axios from 'axios';

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
  const response = await fetch(`${API_URL}/users/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
    credentials: 'include'
  });
  if (!response.ok) throw new Error('Failed to register user');
  return response.json();
};

export const loginUser = async (credentials: { email: string; password: string }) => {
  const response = await fetch(`${API_URL}/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
    credentials: 'include'
  });
  if (!response.ok) throw new Error('Failed to login');
  return response.json();
};