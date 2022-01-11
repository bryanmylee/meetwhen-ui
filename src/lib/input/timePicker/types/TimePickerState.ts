import type { Readable } from 'svelte/store';
import type { Interval } from '$lib/core/types/Interval';
import type { Set } from 'immutable';
import type { TimeCell } from './TimeCell';

export interface TimePickerState {
	localIntervals: Readable<Interval[]>;
	timeBlocks: Readable<Interval[]>;
	endOfBlockIds: Readable<Set<number>>;
	intervalsByDay: Readable<Record<number, Interval[]>>;
	timeCellsByDay: Readable<Record<number, TimeCell[]>>;
}
