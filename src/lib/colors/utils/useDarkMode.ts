import type { ThemeType } from '$lib/core/types/ThemeType';
import { writable } from 'svelte/store';
import type { Readable, Writable } from 'svelte/store';

const IS_DARK_MEDIA_QUERY = '(prefers-color-scheme: dark)';

export const useDarkMode = (theme: Writable<ThemeType>): Readable<boolean> => {
	const isDarkStore = writable(false);

	const attachMediaListener = () => {
		if (typeof window === 'undefined') {
			return;
		}
		updateDocument(window.matchMedia(IS_DARK_MEDIA_QUERY).matches);
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
		updateDocument(event.matches);
	};

	const updateDocument = (isDark: boolean) => {
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
			updateDocument($theme === 'dark');
		}
	});

	return isDarkStore;
};
