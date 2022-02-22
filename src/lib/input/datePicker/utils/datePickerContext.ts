import type { Writable } from 'svelte/store';
import { pairedContext } from '$lib/core/utils';

export const { get: getCurrentDateElement, set: setCurrentDateElement } =
	pairedContext<Writable<Maybe<HTMLButtonElement>>>();
