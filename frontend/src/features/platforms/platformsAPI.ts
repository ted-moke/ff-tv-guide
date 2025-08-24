import { Platform } from './platformTypes';

const API_URL = import.meta.env.VITE_API_URL;

export const fetchPlatforms = async (): Promise<Platform[]> => {
  const response = await fetch(`${API_URL}/platforms?_t=${Date.now()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch platforms');
  }
  const data = await response.json();
  return data.platforms || data; // Handle both new and old response formats
};