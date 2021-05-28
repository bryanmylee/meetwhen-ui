import { writable } from 'svelte/store';
import type { MeetingDTO } from './gql/types/meeting';

export const showAuth = writable(false);
export const loadingMeetingPromise = writable<Promise<MeetingDTO>>(null);
export const newMeeting = writable<MeetingDTO>(null);
