import type { Writable } from 'svelte/store';
import type { Maybe } from '$lib/core/types/Maybe';
import { pairedContext } from '$lib/core/utils/pairedContext';

export const { get: getCurrentDateElement, set: setCurrentDateElement } =
	pairedContext<Writable<Maybe<HTMLButtonElement>>>();
