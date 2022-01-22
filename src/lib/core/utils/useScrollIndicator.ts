import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { Action } from '../types/Action';
import { scrollOffset } from './useScrollOffset';

export interface ScrollIndicator {
	showX: boolean;
	showY: boolean;
}

export const scrollIndicator: Action<Writable<ScrollIndicator>> = (
	node,
	indicator,
) => {
	const { scrollHeight, scrollWidth, clientHeight, clientWidth } = node;
	if (scrollHeight === clientHeight) {
		return {};
	}

	const threshold = 10;

	const offset = writable({ x: 0, y: 0 });
	scrollOffset(node, offset);
	const unsubOffset = offset.subscribe(($offset) => {
		// TODO provide customization options for threshold
		const showX = $offset.x + clientWidth + threshold < scrollWidth;
		const showY = $offset.y + clientHeight + threshold < scrollHeight;
		indicator.set({ showX, showY });
	});

	return {
		destroy() {
			unsubOffset();
		},
	};
};
