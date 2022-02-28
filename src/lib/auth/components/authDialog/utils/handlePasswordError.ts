import type { WithErrorable } from '$lib/core/utils/withError';

export interface HandlePasswordErrorProps {
	code: string;
	name: WithErrorable<string>;
	email: WithErrorable<string>;
	password: WithErrorable<string>;
}

export const handlePasswordError = ({
	code,
	name,
	email,
	password,
}: HandlePasswordErrorProps): void => {
	// EMAIL
	if (code === 'auth/user-not-found') {
		email.update(($email) => ({
			...$email,
			error: 'User not found',
		}));
	} else if (code === 'auth/email-already-exists') {
		email.update(($email) => ({
			...$email,
			error: 'Email already taken',
		}));
	} else if (code === 'auth/invalid-email') {
		email.update(($email) => ({
			...$email,
			error: 'Invalid email',
		}));
		// NAME
	} else if (code === 'auth/invalid-display-name') {
		email.update(($email) => ({
			...$email,
			error: 'Invalid email',
		}));
		// PASSWORD
	} else if (code === 'auth/wrong-password') {
		password.update(($password) => ({
			...$password,
			error: 'Incorrect password',
		}));
	}
};
