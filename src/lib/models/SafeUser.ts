import type { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import type { User } from 'firebase/auth';

export type SafeUser =
	| (User & { ssr: false })
	| (DecodedIdToken & { ssr: true });
