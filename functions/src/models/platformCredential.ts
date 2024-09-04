export interface PlatformCredential {
  id: string;
  credential: string;
  platformId: string;
  userId: string;
  externalUserId?: string; // Add this field
}
