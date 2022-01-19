import { GoogleAuthProvider, OAuthProvider } from 'firebase/auth';

export const googleProvider = new GoogleAuthProvider();
export const appleProvider = new OAuthProvider('apple.com');
