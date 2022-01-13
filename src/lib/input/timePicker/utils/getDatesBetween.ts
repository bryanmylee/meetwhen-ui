import type { Dayjs } from 'dayjs';

export const getDatesBetween = (
	from: Dayjs,
	to: Dayjs,
	dates: Dayjs[],
): Dayjs[] => {
	let fromIndex = dates.findIndex((d) => d.isSame(from, 'day'));
	let toIndex = dates.findIndex((d) => d.isSame(to, 'day'));
	if (fromIndex > toIndex) {
		const temp = fromIndex;
		fromIndex = toIndex;
		toIndex = temp;
	}
	return dates.slice(fromIndex, toIndex + 1);
};
