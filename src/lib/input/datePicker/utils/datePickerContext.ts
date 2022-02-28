import type { Writable } from 'svelte/store';
import { pairedContext } from '$lib/core/utils';

export const [getCurrentDateElement, setCurrentDateElement] =
	pairedContext<Writable<Maybe<HTMLButtonElement>>>();
