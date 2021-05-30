import { writable } from 'svelte/store';
import type { Meeting, User } from './gql/types';

export const showAuth = writable(false);

export const loadingMeetingPromise = writable<Promise<Meeting>>(null);
export const newMeeting = writable<Meeting>(null);
export const currentUser = writable<Partial<User>>(null);
