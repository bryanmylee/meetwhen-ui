import type { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

export interface Session {
	idToken?: DecodedIdToken;
}
