import chroma from 'chroma-js';
import type { Color } from 'chroma-js';
import type { ColorScheme } from '../types/ColorScheme';

const LUMS = {
	50: 0.9,
	100: 0.8,
	200: 0.62,
	300: 0.45,
	400: 0.3,
	500: 0.2,
	600: 0.16,
	700: 0.11,
	800: 0.07,
	900: 0.04,
} as const;

const getGradedHex = (color: Color, grade: keyof typeof LUMS) => {
	return color.luminance(LUMS[grade]).hex();
};

export const getColorScheme = (hex: string): ColorScheme => {
	const baseColor = chroma(hex);
	return {
		50: getGradedHex(baseColor, 50),
		100: getGradedHex(baseColor, 100),
		200: getGradedHex(baseColor, 200),
		300: getGradedHex(baseColor, 300),
		400: getGradedHex(baseColor, 400),
		500: getGradedHex(baseColor, 500),
		600: getGradedHex(baseColor, 600),
		700: getGradedHex(baseColor, 700),
		800: getGradedHex(baseColor, 800),
		900: getGradedHex(baseColor, 900),
	};
};
