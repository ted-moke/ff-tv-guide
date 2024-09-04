import { Platform } from './platformTypes';

const API_URL = import.meta.env.VITE_API_URL;

export const fetchPlatforms = async (): Promise<Platform[]> => {
  const response = await fetch(`${API_URL}/platforms`);
  if (!response.ok) {
    throw new Error('Failed to fetch platforms');
  }
  return response.json();
};