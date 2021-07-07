import { writable } from 'svelte/store';
import type { Meeting } from './gql/types';

export const APP_ROOT_ID = 'meetwhen';

export const loadingMeetingPromise = writable<Promise<Meeting>>(null);
export const newMeeting = writable<Meeting>(null);
export const activeMeeting = writable<Meeting>(null);
