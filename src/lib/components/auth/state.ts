import type { WithError } from '$lib/utils/with-error';
import { withError } from '$lib/utils/with-error';
import type { Writable } from 'svelte/store';

export interface AuthModalState {
	name: Writable<WithError<string>>;
	email: Writable<WithError<string>>;
	password: Writable<WithError<string>>;
	resetErrors: () => void;
}

export const getAuthModalState = (): AuthModalState => {
	const name = withError('');
	const email = withError('');
	const password = withError('');
	const resetErrors = () => {
		name.update(($name) => ({ ...$name, error: '' }));
		email.update(($email) => ({ ...$email, error: '' }));
		password.update(($password) => ({ ...$password, error: '' }));
	};
	return {
		name,
		email,
		password,
		resetErrors,
	};
};
