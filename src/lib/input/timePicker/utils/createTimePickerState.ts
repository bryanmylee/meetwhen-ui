import { onDestroy } from 'svelte';
import { derived, writable } from 'svelte/store';
import type { Readable, Writable } from 'svelte/store';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { withPrevious } from 'svelte-previous';
import { timeToId } from '$lib/core/utils/dayjs/timeIds';
import type { Interval } from '$lib/core/types';
import {
	getLocalIntervals,
	groupIntervalsByDateId,
	isIntervalEqual,
} from '$lib/core/utils/intervals';
import type { TimeCell } from '../types/TimeCell';
import { getFlattenedTimeCells } from './getFlattenedTimeCells';
import { getFlattenedTimeBlocks } from './getFlattenedTimeBlocks';
import { dateFromId } from '$lib/core/utils/dayjs/dateIds';

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
	flattenedTimeCells: Readable<TimeCell[]>;
	timeIdToRowNumber: Readable<Record<string, number>>;
	intervalsByDateId: Readable<Record<string, Interval[]>>;
	dateIds: Readable<string[]>;
	timeCellsByDateId: Readable<Record<string, TimeCell[]>>;
	dateIdToColumnNumber: Readable<Record<string, number>>;
}

export const createTimePickerState = ({
	initValidIntervals,
	initResolution,
}: TimePickerProps): [TimePickerControls, TimePickerState] => {
	const [validIntervals, previousValidIntervals] = withPrevious(
		initValidIntervals,
		{
			requireChange: true,
			isEqual: (a, b) => {
				if (a.length !== b.length) {
					return false;
				}
				if (a.length === 0) {
					return true;
				}
				if (!isIntervalEqual(a[0], b[0])) {
					return false;
				}
				return true;
			},
		},
	);

	const resolution = writable(initResolution);
	const currentDateTime = writable<Dayjs>(dayjs());

	// If valid intervals are created, set the current date time to the first element.
	onDestroy(
		derived(
			[validIntervals, previousValidIntervals],
			(values) => values,
		).subscribe(([$valid, $prevValid]) => {
			if ($prevValid != null && $prevValid.length === 0 && $valid.length > 0) {
				currentDateTime.set($valid[0].start);
			}
		}),
	);

	const localIntervals = derived(validIntervals, getLocalIntervals);

	const flattenedTimeBlocks = derived(localIntervals, ($localIntervals) =>
		getFlattenedTimeBlocks($localIntervals),
	);

	const flattenedTimeCells = derived(
		[localIntervals, flattenedTimeBlocks, resolution],
		([$localIntervals, $flattenedTimeBlocks, $resolution]) =>
			getFlattenedTimeCells($localIntervals, $flattenedTimeBlocks, $resolution),
	);

	const timeIdToRowNumber = derived(
		flattenedTimeCells,
		($flattenedTimeCells) => {
			let rowNumber = 0;
			const $timeIdToRowNumber: Record<string, number> = {};
			$flattenedTimeCells.forEach((timeCell) => {
				$timeIdToRowNumber[timeToId(timeCell.time)] = rowNumber++;
				if (timeCell.isEndOfBlock) {
					rowNumber++;
				}
			});
			return $timeIdToRowNumber;
		},
	);

	const intervalsByDateId = derived(localIntervals, ($localIntervals) => {
		return groupIntervalsByDateId($localIntervals);
	});

	const timeCellsByDateId = derived(
		[intervalsByDateId, flattenedTimeBlocks, resolution],
		([$intervalsByDateId, $localTimeBlocks, $resolution]) => {
			const $timeCellsByDateId: Record<string, TimeCell[]> = {};
			Object.entries($intervalsByDateId).forEach(([dateId, intervals]) => {
				const date = dateFromId(dateId);
				$timeCellsByDateId[dateId] = getFlattenedTimeCells(
					intervals,
					$localTimeBlocks,
					$resolution,
					date,
				);
			});
			return $timeCellsByDateId;
		},
	);

	const dateIds = derived(timeCellsByDateId, ($timeCellsByDateId) =>
		Object.keys($timeCellsByDateId),
	);

	const dateIdToColumnNumber = derived(dateIds, ($dateIds) => {
		let columnNumber = 0;
		const $dateIdToColumnNumber: Record<string, number> = {};
		$dateIds.forEach((dateId) => {
			$dateIdToColumnNumber[dateId] = columnNumber++;
		});
		return $dateIdToColumnNumber;
	});

	return [
		{
			validIntervals,
			resolution,
			currentDateTime,
		},
		{
			localIntervals,
			flattenedTimeCells,
			intervalsByDateId,
			timeIdToRowNumber,
			dateIds,
			dateIdToColumnNumber,
			timeCellsByDateId,
		},
	];
};
