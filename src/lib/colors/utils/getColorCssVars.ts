import { cssVars } from '$lib/core/utils';
import type { ColorScheme } from '../types/ColorScheme';

export const getColorCssVars = (name: string, scheme: ColorScheme): string =>
	cssVars(
		Object.fromEntries(
			Object.entries(scheme).map(([grade, hex]) => [`${name}-${grade}`, hex]),
		),
	);
