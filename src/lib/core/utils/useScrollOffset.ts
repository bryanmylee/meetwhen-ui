import type { Writable } from 'svelte/store';
import type { Action } from '../types/Action';

export interface ScrollOffset {
	x: number;
	y: number;
}

export const scrollOffset: Action<Writable<ScrollOffset>> = (node, offset) => {
	const handleScroll = () => {
		offset.set({
			x: node.scrollLeft,
			y: node.scrollTop,
		});
	};

	node.addEventListener('scroll', handleScroll);
	return {
		destroy() {
			node.removeEventListener('scroll', handleScroll);
		},
	};
};
