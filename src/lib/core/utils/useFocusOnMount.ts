import type { Action } from '$lib/core/types/Action';

export interface FocusOnMountProps {
	delay?: number;
}

export const focusOnMount: Action<FocusOnMountProps> = (
	node,
	{ delay = undefined } = {},
) => {
	if (delay === undefined) {
		node.focus();
	} else {
		setTimeout(() => {
			node.focus();
		}, delay);
	}
};
