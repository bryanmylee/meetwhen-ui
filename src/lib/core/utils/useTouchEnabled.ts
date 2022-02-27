import { readable } from 'svelte/store';
import type { Readable } from 'svelte/store';

export const useTouchEnabled = (): Readable<boolean> => {
	if (typeof document === 'undefined') {
		return readable(false);
	}
	return readable<boolean>(false, (set) => {
		const handleTouch = () => {
			set(true);
			window.removeEventListener('touchstart', handleTouch);
		};

		window.addEventListener('touchstart', handleTouch);

		return () => {
			window.removeEventListener('touchstart', handleTouch);
		};
	});
};
