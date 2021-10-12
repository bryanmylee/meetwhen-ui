export const range = (start: number, stop?: number, step = 1): number[] => {
	if (stop === undefined) {
		return range(0, start, step);
	}
	const interval = stop - start;
	const count = Math.ceil(interval / step);
	return [...Array(count)].map((_, i) => i * step + start);
};
