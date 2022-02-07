import chroma from 'chroma-js';
import type { Color } from 'chroma-js';

export type ColorScale = (numerator: number, denominator: number) => Color;

const ratioWithMin = (ratio: number, min: number) => {
	return ratio * (1 - min) + min;
};

const ratioWithMax = (ratio: number, max: number) => {
	return ratio * max;
};

export const getColorScale = (hex: string, isDark = false): ColorScale => {
	const color = chroma(hex);
	const light = color.brighten(1).desaturate(0.5);
	const dark = color.darken(2);
	const scalePoints = isDark ? [dark, color, light] : [light, color, dark];
	const scale = chroma.scale(scalePoints).mode('lrgb');
	return (numerator, denominator) => {
		const mostIndex = ratioWithMin(Math.min(1, denominator / 10), 0.5);
		const index = ratioWithMax(numerator / denominator, mostIndex);
		return scale(index).alpha(ratioWithMin(index, 0.2));
	};
};
