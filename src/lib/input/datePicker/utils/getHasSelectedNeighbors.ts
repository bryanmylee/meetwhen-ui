import type { HasNeighbors } from '$lib/core/types/HasNeighbors';
import type { Dayjs } from 'dayjs';

export const getHasSelectedNeighbors = (
	center: Dayjs,
	selectedDates: Dayjs[],
): HasNeighbors => {
	return {
		top: hasTop(center, selectedDates),
		bottom: hasBottom(center, selectedDates),
		left: hasLeft(center, selectedDates),
		right: hasRight(center, selectedDates),
	};
};

const hasBottom = (center: Dayjs, others: Dayjs[]) => {
	return others.some(
		(o) => center.isSame(o, 'month') && center.date() + 7 === o.date(),
	);
};

const hasLeft = (center: Dayjs, others: Dayjs[]) => {
	if (center.day() % 7 === 1) return false;
	return others.some(
		(o) => center.isSame(o, 'month') && center.date() - 1 === o.date(),
	);
};

const hasRight = (center: Dayjs, others: Dayjs[]) => {
	if (center.day() % 7 === 0) return false;
	return others.some(
		(o) => center.isSame(o, 'month') && center.date() + 1 === o.date(),
	);
};

const hasTop = (center: Dayjs, others: Dayjs[]) => {
	return others.some(
		(o) => center.isSame(o, 'month') && center.date() - 7 === o.date(),
	);
};
