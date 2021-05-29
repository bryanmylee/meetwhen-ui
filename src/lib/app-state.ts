import { writable } from 'svelte/store';
import type { Meeting } from './gql/types/meeting';
import type { User } from './gql/types/user';

export const showAuth = writable(false);

export const loadingMeetingPromise = writable<Promise<Meeting>>(null);
export const newMeeting = writable<Meeting>(null);
export const currentUser = writable<User>(null);
