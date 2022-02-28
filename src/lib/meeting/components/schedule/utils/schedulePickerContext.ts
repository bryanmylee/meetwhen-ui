import type { Writable } from 'svelte/store';
import type { Dayjs } from 'dayjs';
import type { Set } from 'immutable';
import { pairedContext } from '$lib/core/utils';

export const [getScheduleAdjacencySet, setScheduleAdjacencySet] =
	pairedContext<Writable<Set<Dayjs>>>();
