import { session as _session } from '$app/stores';
import type { Writable } from 'svelte/store';
import type { Session } from '$lib/core/types/Session';

export const session: Writable<Session> = _session;
