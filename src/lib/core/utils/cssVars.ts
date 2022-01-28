const escapedKey = (key: string) => key.replace(/[/+]/gi, '\\$&');

export const cssVars = (vars: Record<string, string | number>): string =>
	Object.entries(vars)
		.map(([key, value]) => `--${escapedKey(key)}:${value}`)
		.join(';');
