import type { Writable } from 'svelte/store';
import type { Dayjs } from 'dayjs';
import type { Set } from 'immutable';
import { pairedContext } from '$lib/core/utils/pairedContext';

export const { get: getScheduleAdjacencySet, set: setScheduleAdjacencySet } =
	pairedContext<Writable<Set<Dayjs>>>();
