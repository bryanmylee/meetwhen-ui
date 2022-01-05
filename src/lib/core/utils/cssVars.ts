export const cssVars = (vars: Record<string, string | number>): string =>
	Object.entries(vars)
		.map(([key, value]) => `--${key}:${value}`)
		.join(';');
