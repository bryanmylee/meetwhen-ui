import watchMedia from 'svelte-media';
import { useColor, PRIMARY_HEX } from '$lib/colors';
import { writable } from 'svelte/store';
import type { Readable, Writable } from 'svelte/store';
import type { ThemeType } from '$lib/core/types';
import { pairedContext } from '$lib/core/utils';
import type { Meeting } from '$lib/models';

export const {
	hex: primaryHex,
	scheme: primaryScheme,
	scale: primaryScale,
	vars: primaryVars,
} = useColor('primary', PRIMARY_HEX);

export const isAuthOpen = writable(false);
export const isGuestAuthOpen = writable(false);
export const activeMeeting = writable<Maybe<Id<Meeting>>>(undefined);

export const [useTheme, setTheme] = pairedContext<Writable<ThemeType>>();

export const [useIsDark, setIsDark] = pairedContext<Readable<boolean>>();

export const media = watchMedia({
	sm: '(min-width: 640px)',
	md: '(min-width: 768px)',
});
