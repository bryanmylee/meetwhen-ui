import { onMount } from 'svelte';
import { writable } from 'svelte/store';
import type { Readable } from 'svelte/store';
import type { Maybe } from '$lib/core/types/Maybe';

export const useScreenHeight = (): Readable<Maybe<number>> => {
	const height = writable<Maybe<number>>(undefined);

	const handleResize = () => {
		height.set(window.innerHeight);
	};

	onMount(() => {
		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	});

	return { subscribe: height.subscribe };
};
