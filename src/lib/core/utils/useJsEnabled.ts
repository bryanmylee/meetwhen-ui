import { onMount } from 'svelte';
import { readable } from 'svelte/store';
import type { Readable } from 'svelte/store';

export const useJsEnabled = (): Readable<boolean> => {
	return readable<boolean>(false, (set) => {
		onMount(() => set(true));
	});
};
