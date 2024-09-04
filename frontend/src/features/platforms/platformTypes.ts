export interface Platform {
  id: string;
  name: string;
  credentialType: 'email' | 'username';
}