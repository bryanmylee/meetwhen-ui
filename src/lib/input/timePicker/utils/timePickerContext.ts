import { pairedContext } from '$lib/core/utils';
import type { Writable } from 'svelte/store';
import type {
	TimePickerControls,
	TimePickerState,
} from './createTimePickerState';

export const { get: getTimePickerState, set: setTimePickerState } =
	pairedContext<TimePickerState>();

export const { get: getTimePickerControls, set: setTimePickerControls } =
	pairedContext<TimePickerControls>();

export const {
	get: getCurrentDateTimeElement,
	set: setCurrentDateTimeElement,
} = pairedContext<Writable<Maybe<HTMLElement>>>();

export const { get: getScrollElement, set: setScrollElement } =
	pairedContext<Writable<Maybe<HTMLElement>>>();
