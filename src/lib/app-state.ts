import { dev } from '$app/env';
import { DEFAULT_PRIMARY_COLOR, useColor } from '$lib/utils/stores/colors-store';
import { useDarkMode } from '$lib/utils/stores/dark-mode-store';
import watchMedia from 'svelte-media';
import { cubicOut } from 'svelte/easing';
import { writable } from 'svelte/store';
import { crossfade, fade } from 'svelte/transition';
import type { Meeting } from './gql/types';
import { useTouchEnabled } from './utils/stores/touch-enabled-store';

// stub console.
if (!dev) {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const emptyFunction = () => {};
  console.log = emptyFunction;
  console.warn = emptyFunction;
  console.info = emptyFunction;
  console.error = emptyFunction;
}

export const APP_ROOT_ID = 'meetwhen';

export const isLoadingApi = writable<boolean>(false);
export const loadingMeetingPromise = writable<Promise<Meeting>>(null);
export const newMeeting = writable<Partial<Meeting>>(null);
export const activeMeeting = writable<Meeting>(null);

export const [send, receive] = crossfade({
  duration: 500,
  easing: cubicOut,
  fallback: (node, params) => fade(node, { ...params, duration: 200 }),
});

export const touchEnabled = useTouchEnabled();

const primaryColor = useColor('primary', DEFAULT_PRIMARY_COLOR);
export const [primaryColorBase, primaryColorSet, primaryColorCssVars] = primaryColor;

export const [isDark, darkModeSetting] = useDarkMode();

const mediaQueries = {
  md: '(min-width: 768px)',
};

export const media = watchMedia(mediaQueries);
