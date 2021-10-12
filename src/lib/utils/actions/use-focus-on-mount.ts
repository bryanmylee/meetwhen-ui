import type { Action } from '$lib/typings/action';

export const focusOnMount: Action<boolean> = (node, enabled) => {
	if (enabled) {
		setTimeout(() => {
			node.focus();
		});
	}
};
