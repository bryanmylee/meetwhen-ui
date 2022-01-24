import type { Maybe } from '../types/Maybe';

export const definedOnly = <T extends Record<string, unknown>>(source: {
	[K in keyof T]: Maybe<T[K]>;
}): T => {
	const result = { ...source };
	Object.keys(result).forEach((key) => {
		if (result[key] === undefined) {
			delete result[key];
		}
	});
	return result as T;
};
