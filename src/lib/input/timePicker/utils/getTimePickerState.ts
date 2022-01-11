import { derived } from 'svelte/store';
import type { Readable } from 'svelte/store';
import { Set } from 'immutable';
import type { Interval } from '$lib/core/types/Interval';
import {
	getIntervalDiscretes,
	getLocalIntervals,
	groupIntervalsByDay,
} from '$lib/core/utils/intervals';
import type { TimePickerState } from '../types/TimePickerState';
import { getTimeBlocks } from './getTimeBlocks';
import type { TimeCell } from '../types/TimeCell';

export const getTimePickerState = (
	validIntervals: Readable<Interval[]>,
	resolution: Readable<number>,
): TimePickerState => {
	const localIntervals = derived(validIntervals, getLocalIntervals);
	const timeBlocks = derived(localIntervals, getTimeBlocks);
	const endOfBlockIds = derived(timeBlocks, ($timeBlocks) =>
		Set($timeBlocks.map(({ end }) => end.unix())),
	);
	const intervalsByDay = derived(localIntervals, groupIntervalsByDay);

	const timeCellsByDay = derived(
		[endOfBlockIds, intervalsByDay, resolution],
		([$endOfBlockIds, $intervalsByDay, $resolution]) => {
			const $timeCellsByDay: Record<string, TimeCell[]> = {};
			Object.entries($intervalsByDay).forEach(([dayId, intervals]) => {
				$timeCellsByDay[dayId] = [];
				intervals.forEach((interval) => {
					const discretes = getIntervalDiscretes(interval, $resolution);
					const timeCells: TimeCell[] = discretes.map((discrete) => ({
						isEndOfBlock: false,
						time: discrete,
					}));
					if ($endOfBlockIds.includes(interval.end.unix())) {
						timeCells[timeCells.length - 1].isEndOfBlock = true;
					}
					$timeCellsByDay[dayId].push(...timeCells);
				});
			});
			return $timeCellsByDay;
		},
	);

	return {
		localIntervals,
		timeBlocks,
		endOfBlockIds,
		intervalsByDay,
		timeCellsByDay,
	};
};
