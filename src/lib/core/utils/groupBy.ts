export const groupBy = <T extends Record<string, unknown>>(
	data: T[],
	getKey: (item: T) => string,
): Record<string, T[]> => {
	const result: Record<string, T[]> = {};
	data.forEach((item) => {
		const key = getKey(item);
		if (!Object.keys(result).includes(key)) {
			result[key] = [];
		}
		result[key].push(item);
	});
	return result;
};
