import type { Writable } from 'svelte/store';
import type { Action } from '../types/Action';

export const focus: Action<Writable<boolean>> = (node, isFocusing) => {
	const handleFocus = () => {
		isFocusing.set(true);
	};

	const handleBlur = () => {
		isFocusing.set(false);
	};

	node.addEventListener('focus', handleFocus);
	node.addEventListener('blur', handleBlur);

	return {
		destroy() {
			node.removeEventListener('focus', handleFocus);
			node.removeEventListener('blur', handleBlur);
		},
	};
};
