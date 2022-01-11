import { derived } from 'svelte/store';
import type { Readable } from 'svelte/store';
import { timeToId } from '$lib/core/utils/dayjs/timeIds';
import type { Interval } from '$lib/core/types/Interval';
import {
	getLocalIntervals,
	groupIntervalsByDay,
} from '$lib/core/utils/intervals';
import type { TimePickerState } from '../types/TimePickerState';
import type { TimeCell } from '../types/TimeCell';
import { getLocalTimeCells } from './getLocalTimeCells';

export const createTimePickerState = (
	validIntervals: Readable<Interval[]>,
	resolution: Readable<number>,
): TimePickerState => {
	const localIntervals = derived(validIntervals, getLocalIntervals);

	const localTimeCells = derived(
		[localIntervals, resolution],
		([$localIntervals, $resolution]) =>
			getLocalTimeCells($localIntervals, $resolution),
	);

	const timeIdToRowNumber = derived(localTimeCells, ($timeCells) => {
		let rowNumber = 0;
		const $timeIdToRowNumber: Record<string, number> = {};
		$timeCells.forEach((timeCell) => {
			$timeIdToRowNumber[timeToId(timeCell.time)] = rowNumber++;
			if (timeCell.isEndOfBlock) {
				rowNumber++;
			}
		});
		return $timeIdToRowNumber;
	});

	const intervalsByDay = derived(localIntervals, groupIntervalsByDay);

	const dateIds = derived(intervalsByDay, ($intervalsByDay) =>
		Object.keys($intervalsByDay),
	);

	const dateIdToColumnNumber = derived(dateIds, ($dateIds) => {
		let columnNumber = 0;
		const $dateIdToColumnNumber: Record<string, number> = {};
		$dateIds.forEach((dateId) => {
			$dateIdToColumnNumber[dateId] = columnNumber++;
		});
		return $dateIdToColumnNumber;
	});

	const timeCellsByDate = derived(
		[intervalsByDay, resolution],
		([$intervalsByDay, $resolution]) => {
			const $timeCellsByDate: Record<string, TimeCell[]> = {};
			Object.entries($intervalsByDay).forEach(([dayId, intervals]) => {
				$timeCellsByDate[dayId] = getLocalTimeCells(intervals, $resolution);
			});
			return $timeCellsByDate;
		},
	);

	return {
		resolution,
		localIntervals,
		localTimeCells,
		timeIdToRowNumber,
		dateIds,
		dateIdToColumnNumber,
		timeCellsByDate,
	};
};
