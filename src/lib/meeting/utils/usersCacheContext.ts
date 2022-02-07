import { pairedContext } from '$lib/core/utils/pairedContext';
import type { UserData } from '$lib/models/UserData';
import type { Writable } from 'svelte/store';

export const { get: getUsersCache, set: setUsersCache } =
	pairedContext<Writable<Record<string, UserData>>>();
