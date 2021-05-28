import { writable } from 'svelte/store';
import type { Meeting } from './gql/types/meeting';

export const showAuth = writable(false);
export const loadingMeetingPromise = writable<Promise<Meeting>>(null);
export const newMeeting = writable<Meeting>(null);
