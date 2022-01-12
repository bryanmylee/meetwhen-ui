import { derived, writable } from 'svelte/store';
import type { Readable, Writable } from 'svelte/store';
import { timeToId } from '$lib/core/utils/dayjs/timeIds';
import type { Interval } from '$lib/core/types/Interval';
import {
	getLocalIntervals,
	groupIntervalsByDay,
} from '$lib/core/utils/intervals';
import type { TimeCell } from '../types/TimeCell';
import { getLocalTimeCells } from './getLocalTimeCells';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

export interface TimePickerProps {
	initValidIntervals: Interval[];
	initResolution: number;
}

export interface TimePickerControls {
	validIntervals: Writable<Interval[]>;
	resolution: Writable<number>;
	currentDateTime: Writable<Dayjs>;
}

export interface TimePickerState {
	localIntervals: Readable<Interval[]>;
	localTimeCells: Readable<TimeCell[]>;
	timeIdToRowNumber: Readable<Record<string, number>>;
	dateIds: Readable<string[]>;
	dateIdToColumnNumber: Readable<Record<string, number>>;
	timeCellsByDate: Readable<Record<string, TimeCell[]>>;
}

export const createTimePickerState = ({
	initValidIntervals,
	initResolution,
}: TimePickerProps): [TimePickerControls, TimePickerState] => {
	const validIntervals = writable(initValidIntervals);
	const resolution = writable(initResolution);
	const currentDateTime = writable(initValidIntervals[0]?.start ?? dayjs());

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

	return [
		{
			validIntervals,
			resolution,
			currentDateTime,
		},
		{
			localIntervals,
			localTimeCells,
			timeIdToRowNumber,
			dateIds,
			dateIdToColumnNumber,
			timeCellsByDate,
		},
	];
};
