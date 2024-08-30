export interface PlatformCredential {
  id: string;
  credentialType: "username" | "email";
  credential: string;
  fantasyPlatformId: string;
}
