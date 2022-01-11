import type { Readable } from 'svelte/store';
import type { Interval } from '$lib/core/types/Interval';
import type { TimeCell } from './TimeCell';

export interface TimePickerState {
	localIntervals: Readable<Interval[]>;
	localTimeCells: Readable<TimeCell[]>;
	timeIdToRowNumber: Readable<Record<string, number>>;
	dateIds: Readable<string[]>;
	dateIdToColumnNumber: Readable<Record<string, number>>;
	timeCellsByDate: Readable<Record<string, TimeCell[]>>;
}
