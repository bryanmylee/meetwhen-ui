import watchMedia from 'svelte-media';
import { useColor, PRIMARY_HEX } from '$lib/colors';
import { writable } from 'svelte/store';
import type { Readable, Writable } from 'svelte/store';
import type { ThemeType } from '$lib/core/types/ThemeType';
import type { Maybe } from '$lib/core/types/Maybe';
import { pairedContext } from '$lib/core/utils/pairedContext';

export const {
	hex: primaryHex,
	scheme: primaryScheme,
	scale: primaryScale,
	vars: primaryVars,
} = useColor('primary', PRIMARY_HEX);

export const isAuthOpen = writable(false);
export const activeMeetingId = writable<Maybe<string>>(undefined);
activeMeetingId.subscribe((a) => console.log(a));

export const { get: useTheme, set: setTheme } =
	pairedContext<Writable<ThemeType>>();

export const { get: useIsDark, set: setIsDark } =
	pairedContext<Readable<boolean>>();

export const media = watchMedia({
	sm: '(min-width: 640px)',
	md: '(min-width: 768px)',
});
