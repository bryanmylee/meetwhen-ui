import type { Dayjs } from 'dayjs';
import type { Set } from 'immutable';
import type { HasNeighbors } from '$lib/core/types/HasNeighbors';
import { dateTimeToId } from '$lib/core/utils/dayjs/dateTimeIds';

export const timePickerHasNeighbours = (
	center: Dayjs,
	resolution: number,
	selectedIdSet: Set<string>,
): HasNeighbors => {
	if (!selectedIdSet.has(dateTimeToId(center))) {
		return {
			top: false,
			bottom: false,
			left: false,
			right: false,
		};
	}
	return {
		top: hasTop(center, resolution, selectedIdSet),
		bottom: hasBottom(center, resolution, selectedIdSet),
		left: false,
		right: false,
	};
};

const hasTop = (
	center: Dayjs,
	resolution: number,
	selectedIdSet: Set<string>,
) => {
	const top = center.subtract(resolution, 'minutes');
	return selectedIdSet.has(dateTimeToId(top)) && center.isSame(top, 'day');
};

const hasBottom = (
	center: Dayjs,
	resolution: number,
	selectedIdSet: Set<string>,
) => {
	const bottom = center.add(resolution, 'minutes');
	return (
		selectedIdSet.has(dateTimeToId(bottom)) && center.isSame(bottom, 'day')
	);
};
