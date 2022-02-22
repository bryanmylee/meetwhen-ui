import { pairedContext } from '$lib/core/utils';
import type { UserRecord } from '$lib/models';
import type { Writable } from 'svelte/store';

export const { get: getUsersCache, set: setUsersCache } =
	pairedContext<Writable<Record<string, UserRecord>>>();
