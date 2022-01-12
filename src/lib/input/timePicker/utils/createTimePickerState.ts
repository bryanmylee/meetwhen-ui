import { onDestroy } from 'svelte';
import { derived, writable } from 'svelte/store';
import type { Readable, Writable } from 'svelte/store';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { withPrevious } from 'svelte-previous';
import { timeToId } from '$lib/core/utils/dayjs/timeIds';
import type { Interval } from '$lib/core/types/Interval';
import {
	getLocalIntervals,
	getLocalIntervalsFromDiscretes,
	groupIntervalsByDateId,
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
	dateIds: Readable<string[]>;
	dateIdToColumnNumber: Readable<Record<string, number>>;
	timeCellsByDateId: Readable<Record<string, TimeCell[]>>;
	blocksByDateId: Readable<Record<string, Interval[]>>;
}

export const createTimePickerState = ({
	initValidIntervals,
	initResolution,
}: TimePickerProps): [TimePickerControls, TimePickerState] => {
	const [validIntervals, previousValidIntervals] = withPrevious(
		initValidIntervals,
		{ requireChange: true, isEqual: (a, b) => a.length === b.length },
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

	const timeCellsByDateId = derived(
		[localIntervals, flattenedTimeBlocks, resolution],
		([$localIntervals, $localTimeBlocks, $resolution]) => {
			const intervalsByDateId = groupIntervalsByDateId($localIntervals);
			const $timeCellsByDateId: Record<string, TimeCell[]> = {};
			Object.entries(intervalsByDateId).forEach(([dateId, intervals]) => {
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

	const blocksByDateId = derived(timeCellsByDateId, ($timeCellsByDateId) => {
		return Object.fromEntries(
			Object.entries($timeCellsByDateId).map(([dateId, timeCells]) => {
				return [
					dateId,
					getLocalIntervalsFromDiscretes(timeCells.map((cell) => cell.time)),
				];
			}),
		);
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
			timeIdToRowNumber,
			dateIds,
			dateIdToColumnNumber,
			timeCellsByDateId,
			blocksByDateId,
		},
	];
};
