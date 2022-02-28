import type { NoPropAction } from '../types/Action';

export const focusOnEnable: NoPropAction = (node) => {
	const observer = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			if (mutation.attributeName === 'disabled') {
				const disabled = node.getAttribute('disabled');
				if (!disabled) {
					node.focus();
				}
			}
		});
	});
	observer.observe(node, {
		attributes: true,
	});

	return {
		destroy() {
			observer.disconnect();
		},
	};
};
