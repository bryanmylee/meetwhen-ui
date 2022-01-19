import type { Action } from '$lib/core/types/Action';

export const focusOnMount: Action = (node) => {
	node.focus();
};
