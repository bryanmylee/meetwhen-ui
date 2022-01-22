import type { NoPropAction } from '$lib/core/types/Action';

export const focusOnMount: NoPropAction = (node) => {
	node.focus();
};
