import { derived, writable } from 'svelte/store';
import type { Readable, Writable } from 'svelte/store';
import type { ColorScheme } from '../types/ColorScheme';
import { getColorScheme } from './getColorScheme';
import { getColorCssVars } from './getColorCssVars';

export interface UseColor {
	hex: Writable<string>;
	scheme: Readable<ColorScheme>;
	vars: Readable<string>;
}

export const useColor = (name: string, initHex: string): UseColor => {
	const hex = writable(initHex);
	const scheme = derived(hex, ($hex) => getColorScheme($hex));
	const vars = derived(scheme, ($scheme) => getColorCssVars(name, $scheme));
	return { hex, scheme, vars };
};
