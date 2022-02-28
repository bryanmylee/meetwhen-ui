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

const getGraded = (color: Color, grade: keyof typeof LUMS) => {
	return color.luminance(LUMS[grade]);
};

const getShifted = (color: Color, shift: number) => {
	const hue = color.get('hsl.h');
	return color.set('hsl.h', hue + shift);
};

export const getColorScheme = (hex: string): ColorScheme => {
	const baseColor = chroma(hex);
	return {
		50: getGraded(baseColor, 50).css(),
		100: getGraded(baseColor, 100).css(),
		200: getGraded(baseColor, 200).css(),
		300: getGraded(baseColor, 300).css(),
		400: getGraded(baseColor, 400).css(),
		'400+1': getShifted(getGraded(baseColor, 400), 6).css(),
		'400-1': getShifted(getGraded(baseColor, 400), -6).css(),
		'400+2': getShifted(getGraded(baseColor, 400), 12).css(),
		'400-2': getShifted(getGraded(baseColor, 400), -12).css(),
		'400/30': getGraded(baseColor, 400).alpha(0.3).css(),
		'400/50': getGraded(baseColor, 400).alpha(0.5).css(),
		500: getGraded(baseColor, 500).css(),
		600: getGraded(baseColor, 600).css(),
		700: getGraded(baseColor, 700).css(),
		800: getGraded(baseColor, 800).css(),
		900: getGraded(baseColor, 900).css(),
	};
};
