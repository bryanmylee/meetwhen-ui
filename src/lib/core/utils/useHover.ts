import type { Writable } from 'svelte/store';
import type { Action } from '../types/Action';

export const hover: Action<Writable<boolean>> = (node, isHovering) => {
	const handleMouseEnter = () => {
		isHovering.set(true);
	};

	const handleMouseLeave = () => {
		isHovering.set(false);
	};

	node.addEventListener('mouseenter', handleMouseEnter);
	node.addEventListener('mouseleave', handleMouseLeave);

	return {
		destroy() {
			node.removeEventListener('mouseenter', handleMouseEnter);
			node.removeEventListener('mouseleave', handleMouseLeave);
		},
	};
};
