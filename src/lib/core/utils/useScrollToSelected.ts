import type { Action } from '../types/Action';

export interface ScrollToSelected {
	alignTop?: boolean;
}

export const scrollToSelected: Action<ScrollToSelected> = (node, params) => {
	const selected = node.querySelector('[aria-selected="true"]');
	if (selected === null) {
		return;
	}
	selected.scrollIntoView(params.alignTop ?? true);
};
