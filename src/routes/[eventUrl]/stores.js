import { writable } from 'svelte/store';

export const layoutStates = ({
  NARROW: 'NARROW',
  WIDE: 'WIDE',
});

export const detailsStates = ({
  EVENT_DETAILS: 'EVENT_DETAILS',
  ATTENDANCE: 'ATTENDANCE',
});

export const formStates = ({
  NONE: 'NONE',
  LOGGING_IN: 'LOGGING_IN',
  JOINING: 'JOINING',
});

export const detailsState = writable(detailsStates.EVENT_DETAILS);
export const formState = writable(formStates.NONE);
export const layoutState = writable(layoutStates.NARROW);
export const selectedUsernames = writable([]);