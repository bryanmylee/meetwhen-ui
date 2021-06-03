import type { Interval } from '$lib/gql/types';
import { withError } from '$lib/utils/with-error';

export const username = withError('');
export const password = withError('');
export const intervals = withError<Interval[]>([]);
