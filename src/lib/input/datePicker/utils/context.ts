import { getContext, setContext } from 'svelte';
import type { Writable } from 'svelte/store';
import type { Maybe } from '$lib/core/types/Maybe';

const CURRENT_DATE_ELEMENT_KEY = {};
export type CurrentDateElement = Writable<Maybe<HTMLButtonElement>>;
export const getCurrentDateElement = (): CurrentDateElement =>
	getContext<CurrentDateElement>(CURRENT_DATE_ELEMENT_KEY);
export const setCurrentDateElement = (context: CurrentDateElement): void =>
	setContext(CURRENT_DATE_ELEMENT_KEY, context);
