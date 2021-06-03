import type { Interval } from '$lib/gql/types';
import { withError } from '$lib/utils/with-error';

export const username = withError('');
export const password = withError('');
export const intervals = withError<Interval[]>([]);

export const resetForm = (): void => {
  username.reset();
  password.reset();
  intervals.reset();
};
