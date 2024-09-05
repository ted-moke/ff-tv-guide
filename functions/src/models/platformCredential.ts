export interface PlatformCredential {
  credential: string;
  platformId: string;
  userId: string;
  externalUserId?: string; // Add this field
}
