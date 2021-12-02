import type { Readable, Writable } from 'svelte/store';
import { writable } from 'svelte/store';
import { useCookie } from './cookie-storage-store';

export type DarkModeSetting = 'dark' | 'light' | 'auto';
const MEDIA_QUERY = '(prefers-color-scheme: dark)';

export const useDarkMode = (): [Readable<boolean>, Writable<DarkModeSetting>] => {
	const updateDocument = (isDark: boolean): void => {
		mediaIsDark.set(isDark);
		if (typeof document === 'undefined') {
			return;
		}
		if (isDark) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	};

	const darkChangeHandler = (event: MediaQueryListEvent) => {
		updateDocument(event.matches);
	};

	const attachDarkMediaListener = () => {
		if (typeof window === 'undefined') {
			return;
		}
		updateDocument(window.matchMedia(MEDIA_QUERY).matches);
		window.matchMedia(MEDIA_QUERY).addEventListener('change', darkChangeHandler);
	};

	const detachDarkMediaListener = () => {
		if (typeof window === 'undefined') {
			return;
		}
		window.matchMedia(MEDIA_QUERY).removeEventListener('change', darkChangeHandler);
	};

	const setting = useCookie<DarkModeSetting>('theme');
	const mediaIsDark = writable(false);

	setting.subscribe(($setting) => {
		if ($setting === 'auto') {
			attachDarkMediaListener();
		} else {
			detachDarkMediaListener();
			updateDocument($setting === 'dark');
		}
	});

	const updateSetting = (fn: (setting: DarkModeSetting) => DarkModeSetting) => {
		setting.update(($setting) => {
			const newSetting = fn($setting);
			if (newSetting === 'auto') {
				attachDarkMediaListener();
			} else {
				detachDarkMediaListener();
				updateDocument(newSetting === 'dark');
			}
			return newSetting;
		});
	};

	return [
		{
			subscribe: mediaIsDark.subscribe,
		},
		{
			subscribe: setting.subscribe,
			update: updateSetting,
			set: (newSetting: DarkModeSetting) => updateSetting(() => newSetting),
		},
	];
};
