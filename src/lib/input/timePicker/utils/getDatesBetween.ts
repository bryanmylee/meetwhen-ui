import type { Dayjs } from 'dayjs';

export const getDatesBetween = (
	from: Dayjs,
	to: Dayjs,
	dates: Dayjs[],
): Dayjs[] => {
	const fromIndex = dates.findIndex((d) => d.isSame(from, 'day'));
	const toIndex = dates.findIndex((d) => d.isSame(to, 'day'));
	return dates.slice(fromIndex, toIndex + 1);
};
