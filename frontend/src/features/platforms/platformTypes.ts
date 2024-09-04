export interface Platform {
  id: string;
  name: string;
  credentialType: 'email' | 'username';
}

export interface PlatformCredential {
  id: string;
  platformId: string;
  userId: string;
  credential: string;
}