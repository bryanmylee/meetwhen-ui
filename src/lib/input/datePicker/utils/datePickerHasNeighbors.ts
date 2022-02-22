import type { Dayjs } from 'dayjs';
import type { Set } from 'immutable';
import type { HasNeighbors } from '$lib/core/types';
import { dateToId } from '$lib/core/utils/dayjs/dateIds';

export const datePickerHasNeighbors = (
	center: Dayjs,
	selectedIdSet: Set<string>,
): HasNeighbors => {
	if (!selectedIdSet.has(dateToId(center))) {
		return {
			top: false,
			bottom: false,
			left: false,
			right: false,
		};
	}
	return {
		top: hasTop(center, selectedIdSet),
		bottom: hasBottom(center, selectedIdSet),
		left: hasLeft(center, selectedIdSet),
		right: hasRight(center, selectedIdSet),
	};
};

const hasTop = (center: Dayjs, selectedIdSet: Set<string>) => {
	const top = center.subtract(7, 'days');
	return selectedIdSet.has(dateToId(top)) && center.isSame(top, 'month');
};

const hasBottom = (center: Dayjs, selectedIdSet: Set<string>) => {
	const bottom = center.add(7, 'days');
	return selectedIdSet.has(dateToId(bottom)) && center.isSame(bottom, 'month');
};

const hasLeft = (center: Dayjs, selectedIdSet: Set<string>) => {
	if (center.day() % 7 === 1) return false;
	const left = center.subtract(1, 'day');
	return selectedIdSet.has(dateToId(left)) && center.isSame(left, 'month');
};

const hasRight = (center: Dayjs, selectedIdSet: Set<string>) => {
	if (center.day() % 7 === 0) return false;
	const right = center.add(1, 'day');
	return selectedIdSet.has(dateToId(right)) && center.isSame(right, 'month');
};
