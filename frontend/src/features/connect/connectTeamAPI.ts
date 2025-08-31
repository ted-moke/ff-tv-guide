import { PlatformCredential } from "../platforms/platformTypes";
import { AuthData } from "../auth/authTypes";

const API_URL = import.meta.env.VITE_API_URL;

export const createPlatformCredential = async (
  credential: Omit<PlatformCredential, "id">
): Promise<PlatformCredential> => {
  const response = await fetch(`${API_URL}/platform-credentials`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
    body: JSON.stringify(credential),
  });

  if (!response.ok) {
    throw new Error("Failed to create platform credential");
  }

  return response.json();
};

export const fetchUserPlatformCredentials = async (
  backendUser?: AuthData | null
): Promise<PlatformCredential[]> => {
  if (!backendUser) {
    return [];
  }

  const response = await fetch(
    `${API_URL}/users/${backendUser.uid}/platform-credentials`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch user platform credentials");
  }

  return response.json();
};
