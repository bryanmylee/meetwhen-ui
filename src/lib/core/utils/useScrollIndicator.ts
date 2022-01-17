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

	const offset = writable({ x: 0, y: 0 });
	scrollOffset(node, offset);
	const unsubOffset = offset.subscribe(($offset) => {
		const showX = $offset.x + clientWidth < scrollWidth;
		const showY = $offset.y + clientHeight < scrollHeight;
		indicator.set({ showX, showY });
	});

	return {
		destroy() {
			unsubOffset();
		},
	};
};
