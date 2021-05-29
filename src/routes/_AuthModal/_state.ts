import { WithError, withError } from '$lib/utils/with-error';
import type { Writable } from 'svelte/store';

export interface AuthModalState {
  name: Writable<WithError<string>>;
  email: Writable<WithError<string>>;
  password: Writable<WithError<string>>;
}

export const getAuthModalState = (): AuthModalState => ({
  name: withError(''),
  email: withError(''),
  password: withError(''),
});
