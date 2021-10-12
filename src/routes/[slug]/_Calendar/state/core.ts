import type { Interval } from '$lib/gql/types';
import { fromId, getLocalIntervals, toId, unionIntervals } from '$lib/utils/intervals';
import type { Readable, Writable } from 'svelte/store';
import { derived, writable } from 'svelte/store';
import type { IntervalsState } from './intervals';
import { getIntervalsState } from './intervals';
import type { ScheduleState } from './schedules';
import { getScheduleState } from './schedules';
import type { SelectionsState } from './selections';
import { getSelectionsState } from './selections';
import type { UiState } from './ui';
import { getUiState } from './ui';

export interface CalendarState extends IntervalsState, ScheduleState, SelectionsState, UiState {
	hourStepSize: Writable<number>;
	getIntervalsFromIds: Readable<(ids: string[]) => Interval[]>;
	getLocalIntervalsFromIds: Readable<(ids: string[]) => Interval[]>;
	getIdsFromIntervals: Readable<(intervals: Interval[]) => string[]>;
}

export const getCoreState = (): CalendarState => {
	const hourStepSize = writable(0.5);

	const getIntervalsFromIds = derived(
		[hourStepSize],
		([$hourStepSize]) =>
			(ids: string[]): Interval[] => {
				const dayHours = ids.map(fromId);
				const intervals: Interval[] = dayHours.map((dayHour) => ({
					beg: dayHour,
					end: dayHour.add($hourStepSize, 'hour'),
				}));
				return unionIntervals(intervals);
			}
	);

	const getLocalIntervalsFromIds = derived(
		[getIntervalsFromIds],
		([$getIntervalsFromIds]) =>
			(ids: string[]): Interval[] =>
				getLocalIntervals($getIntervalsFromIds(ids))
	);

	const getIdsFromIntervals = derived(
		[hourStepSize],
		([$hourStepSize]) =>
			(intervals: Interval[]): string[] => {
				const ids: string[] = [];
				intervals.forEach((interval) => {
					for (
						let current = interval.beg;
						!current.isSame(interval.end);
						current = current.add($hourStepSize, 'hour')
					) {
						ids.push(toId(current));
					}
				});
				return ids;
			}
	);

	const intervalsState = getIntervalsState(hourStepSize);
	const scheduleState = getScheduleState();
	const selectionsState = getSelectionsState({
		hourStepSize,
		getIntervalsFromIds,
		allDayHours: intervalsState.allDayHours,
		days: intervalsState.days,
	});
	const uiState = getUiState({
		hourStepSize,
		days: intervalsState.days,
		hoursInDay: intervalsState.hoursInDay,
		availables: intervalsState.availables,
		schedules: scheduleState.schedules,
	});

	return {
		hourStepSize,
		getIntervalsFromIds,
		getLocalIntervalsFromIds,
		getIdsFromIntervals,
		...intervalsState,
		...scheduleState,
		...selectionsState,
		...uiState,
	};
};
