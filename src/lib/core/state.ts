import { useColor, PRIMARY_HEX } from '$lib/colors';
import { writable } from 'svelte/store';

export const {
	hex: primaryHex,
	scheme: primaryScheme,
	scale: primaryScale,
	vars: primaryVars,
} = useColor('primary', PRIMARY_HEX);

export const isAuthOpen = writable(false);
