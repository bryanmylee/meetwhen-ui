import type { Schedule } from '$lib/gql/types';
import { writable } from 'svelte/store';

// Logic for all user schedules and the nested intervals.

export const schedules = writable<Schedule[]>([]);
