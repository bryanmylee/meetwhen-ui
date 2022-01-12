import { pairedContext } from '$lib/core/utils/pairedContext';
import type { Maybe } from '$lib/core/types/Maybe';
import type { Writable } from 'svelte/store';
import type { TimePickerState } from './createTimePickerState';

export const { get: getTimePickerState, set: setTimePickerState } =
	pairedContext<TimePickerState>();

export const {
	get: getCurrentDateTimeElement,
	set: setCurrentDateTimeElement,
} = pairedContext<Writable<Maybe<HTMLButtonElement>>>();
