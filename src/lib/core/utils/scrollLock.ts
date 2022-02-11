import type { Nullable } from '../types/Nullable';

export interface LockedElement {
	element: HTMLElement;
	initialOverflow: string;
}

export const scrollLock = (fromElement: HTMLElement): LockedElement[] => {
	if (typeof document === 'undefined' || typeof window === 'undefined') {
		return [];
	}
	const lockedElements: LockedElement[] = [];
	let currElement: Nullable<HTMLElement> = fromElement;
	while (currElement !== null && currElement !== document.documentElement) {
		const computedOverflow = getComputedStyle(currElement).overflow;
		console.log({ currElement, computedOverflow });
		if (computedOverflow === 'auto' || computedOverflow === 'scroll') {
			lockedElements.push({
				element: currElement,
				initialOverflow: currElement.style.overflow,
			});
			currElement.style.overflow = 'hidden';
		}
		currElement = currElement.parentElement;
	}
	document.documentElement.style.overflow = 'hidden';
	return lockedElements;
};

export const scrollUnlock = (lockedElements: LockedElement[]): void => {
	if (typeof document === 'undefined' || typeof window === 'undefined') {
		return;
	}
	lockedElements.forEach(({ element, initialOverflow }) => {
		element.style.overflow = initialOverflow;
	});
	document.documentElement.style.overflow = 'auto';
};
