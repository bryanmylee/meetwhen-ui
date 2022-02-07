import { derived, writable } from 'svelte/store';
import type { Readable, Writable } from 'svelte/store';
import type { ColorScheme } from '../types/ColorScheme';
import { getColorScheme } from './getColorScheme';
import { getColorCssVars } from './getColorCssVars';
import { getColorScale } from './getColorScale';
import type { ColorScale } from './getColorScale';

export interface UseColor {
	hex: Writable<string>;
	scheme: Readable<ColorScheme>;
	scale: Readable<ColorScale>;
	vars: Readable<string>;
}

export const useColor = (name: string, initHex: string): UseColor => {
	const hex = writable(initHex);
	const scheme = derived(hex, ($hex) => getColorScheme($hex));
	const scale = derived(hex, ($hex) => getColorScale($hex));
	const vars = derived(scheme, ($scheme) => getColorCssVars(name, $scheme));
	return { hex, scheme, scale, vars };
};
