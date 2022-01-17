import type { Action } from '../types/Action';

export const scrollToSelected: Action = (node) => {
	const selected = node.querySelector('[aria-selected="true"]');
	if (selected === null) {
		return;
	}
	selected.scrollIntoView();
};
