import { Selecting } from '$lib/components/utils/selectable/selecting';
import type { Interval, LocalTimeInterval, Schedule } from '$lib/gql/types';
import { getHoursInTimeInterval, getLocalIntervals } from '$lib/utils/intervals';
import type { Time } from '$lib/utils/time';
import type { Dayjs } from 'dayjs';
import { Set } from 'immutable';
import type { Readable, Writable } from 'svelte/store';
import { derived, writable } from 'svelte/store';

// Stateful logic for transforming data to UI.
interface StateDependencies {
	hourStepSize: Readable<number>;
	days: Readable<Dayjs[]>;
	availables: Readable<LocalTimeInterval[]>;
	schedules: Readable<Schedule[]>;
	hoursInDay: Readable<Time[]>;
}

export interface UiState {
	selecting: Writable<Selecting>;
	isFullscreen: Writable<boolean>;
	getColIndexByDay: Readable<(toFind: Dayjs) => number>;
	numRows: Readable<number>;
	getRowIndexByTime: Readable<(time: Time) => number>;
	intervalHasLeftCorners: Readable<(interval: Interval) => { top: boolean; bottom: boolean }>;
}

export const getUiState = ({
	hourStepSize,
	days,
	availables,
	schedules,
	hoursInDay,
}: StateDependencies): UiState => {
	const selecting = writable(Selecting.NONE);
	const isFullscreen = writable(false);

	const getColIndexByDay = derived(
		[days],
		([$days]) =>
			(toFind: Dayjs) =>
				$days.findIndex((day) => day.isSame(toFind, 'day'))
	);

	const numRows = derived(
		[availables, hoursInDay],
		([$availables, $hoursInDay]) => $availables.length + $hoursInDay.length - 1
	);

	const rowIndexByTimeUnix = derived([availables, hourStepSize], ([$availables, $hourStepSize]) => {
		const rowIndexByTimeUnix: Record<number, number> = {};
		let index = 0;
		$availables.forEach((available) => {
			const hours = getHoursInTimeInterval(available, $hourStepSize);
			hours.forEach(({ unix }) => {
				rowIndexByTimeUnix[unix] = index++;
			});
			index++;
		});
		return rowIndexByTimeUnix;
	});

	const getRowIndexByTime = derived(
		[rowIndexByTimeUnix],
		([$rowIndexByTimeUnix]) =>
			(time: Time) =>
				$rowIndexByTimeUnix[time.unix]
	);

	const allScheduleBegEnds = derived([schedules], ([$schedules]) => {
		let begs: Set<number> = Set();
		let ends: Set<number> = Set();
		$schedules.forEach((schedule) => {
			const intervals = getLocalIntervals(schedule.intervals);
			begs = begs.union(intervals.map((interval) => interval.beg.unix()));
			ends = ends.union(intervals.map((interval) => interval.end.unix()));
		});
		return [begs, ends] as [begs: Set<number>, ends: Set<number>];
	});

	const intervalHasLeftCorners = derived(
		[allScheduleBegEnds],
		([$allScheduleBegEnds]) =>
			(interval: Interval) => {
				const [begs, ends] = $allScheduleBegEnds;
				const hasTopLeftCorner = begs.includes(interval.beg.unix());
				const hasBottomLeftCorner = ends.includes(interval.end.unix());
				return {
					top: hasTopLeftCorner,
					bottom: hasBottomLeftCorner,
				};
			}
	);

	return {
		selecting,
		isFullscreen,
		getColIndexByDay,
		numRows,
		getRowIndexByTime,
		intervalHasLeftCorners,
	};
};
