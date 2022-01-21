import type { NoParamAction } from '$lib/core/types/Action';

export const focusOnMount: NoParamAction = (node) => {
	node.focus();
};
