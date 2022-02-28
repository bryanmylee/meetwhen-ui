import { getContext, onMount } from 'svelte';
import { readable } from 'svelte/store';
import type { Readable } from 'svelte/store';

export const useJsEnabled = (): Readable<boolean> => {
	const mockedJsEnabled = getContext<Maybe<boolean>>('jsEnabled');
	return readable<boolean>(mockedJsEnabled ?? false, (set) => {
		onMount(() => {
			if (mockedJsEnabled === undefined) {
				set(true);
			}
		});
	});
};
