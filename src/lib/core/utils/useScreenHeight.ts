import { onMount } from 'svelte';
import { writable } from 'svelte/store';
import type { Readable } from 'svelte/store';

export const useScreenHeight = (): Readable<Maybe<number>> => {
	const height = writable<Maybe<number>>(undefined);

	const setHeight = () => {
		height.set(window.innerHeight);
	};

	onMount(() => {
		setHeight();
		const updateInterval = window.setInterval(setHeight, 5000);
		window.addEventListener('resize', setHeight);
		return () => {
			window.clearInterval(updateInterval);
			window.removeEventListener('resize', setHeight);
		};
	});

	return { subscribe: height.subscribe };
};
