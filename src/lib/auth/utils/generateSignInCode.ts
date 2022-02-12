import { customAlphabet } from 'nanoid';

export const generateSignInCode = customAlphabet(
	'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',
	6,
);
