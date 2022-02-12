import { pairedContext } from '$lib/core/utils/pairedContext';
import type { UserRecord } from '$lib/models/UserRecord';
import type { Writable } from 'svelte/store';

export const { get: getUsersCache, set: setUsersCache } =
	pairedContext<Writable<Record<string, UserRecord>>>();
