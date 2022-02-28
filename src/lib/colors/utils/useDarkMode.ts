import type { ThemeType } from '$lib/core/types';
import { writable } from 'svelte/store';
import type { Readable, Writable } from 'svelte/store';

const IS_DARK_MEDIA_QUERY = '(prefers-color-scheme: dark)';

export const useDarkMode = (theme: Writable<ThemeType>): Readable<boolean> => {
	const isDarkStore = writable(false);

	const attachMediaListener = () => {
		if (typeof window === 'undefined') {
			return;
		}
		update(window.matchMedia(IS_DARK_MEDIA_QUERY).matches);
		window
			.matchMedia(IS_DARK_MEDIA_QUERY)
			.addEventListener('change', changeHandler);
	};

	const detachMediaListener = () => {
		if (typeof window === 'undefined') {
			return;
		}
		window
			.matchMedia(IS_DARK_MEDIA_QUERY)
			.removeEventListener('change', changeHandler);
	};

	const changeHandler = (event: MediaQueryListEvent) => {
		update(event.matches);
	};

	const update = (isDark: boolean) => {
		isDarkStore.set(isDark);
		if (typeof document === 'undefined') {
			return;
		}
		if (isDark) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	};

	theme.subscribe(($theme) => {
		if ($theme === 'auto') {
			attachMediaListener();
		} else {
			detachMediaListener();
			update($theme === 'dark');
		}
	});

	return isDarkStore;
};
