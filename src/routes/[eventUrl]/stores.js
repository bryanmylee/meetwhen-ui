import { writable, derived } from 'svelte/store';

export const detailsEnum = {
  EVENT_DETAILS: 'EVENT_DETAILS',
  ATTENDANCE: 'ATTENDANCE',
};

export const formEnum = {
  NONE: 'NONE',
  LOGGING_IN: 'LOGGING_IN',
  JOINING: 'JOINING',
  EDITING: 'EDITING',
};

export const details = writable(detailsEnum.EVENT_DETAILS);
export const form = writable(formEnum.NONE);
export const calendarSelectionEnabled = derived(
  form,
  ($form) => $form === formEnum.JOINING || $form === formEnum.EDITING,
);
export const selectedUsernames = writable([]);
export const minUserCountFilter = writable(0);
