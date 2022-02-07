import type { Action } from '../types/Action';

export const clickOutside: Action<(event: MouseEvent) => void> = (
	node,
	callback,
) => {
	const handleClick = (event: MouseEvent) => {
		if (!node.contains(event.target as Node) && !event.defaultPrevented) {
			callback(event);
		}
	};

	document.addEventListener('click', handleClick, { capture: true });
	return {
		destroy() {
			document.removeEventListener('click', handleClick, { capture: true });
		},
	};
};
