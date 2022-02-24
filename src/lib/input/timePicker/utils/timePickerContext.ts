import { pairedContext } from '$lib/core/utils';
import type { Writable } from 'svelte/store';
import type {
	TimePickerControls,
	TimePickerState,
} from './createTimePickerState';

export const [getTimePickerState, setTimePickerState] =
	pairedContext<TimePickerState>();

export const [getTimePickerControls, setTimePickerControls] =
	pairedContext<TimePickerControls>();

export const [getCurrentDateTimeElement, setCurrentDateTimeElement] =
	pairedContext<Writable<Maybe<HTMLElement>>>();

export const [getScrollElement, setScrollElement] =
	pairedContext<Writable<Maybe<HTMLElement>>>();
