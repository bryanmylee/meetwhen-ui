export interface LockedElement {
	element: HTMLElement;
	initialOverflow: string;
	initialUserSelect: string;
}

export const scrollLock = (fromElement: HTMLElement): LockedElement[] => {
	if (typeof document === 'undefined' || typeof window === 'undefined') {
		return [];
	}
	const lockedElements: LockedElement[] = [];
	let currElement: Nullable<HTMLElement> = fromElement;
	while (currElement !== null && currElement !== document.documentElement) {
		const computedOverflow = getComputedStyle(currElement).overflow;
		lockedElements.push({
			element: currElement,
			initialOverflow: currElement.style.overflow,
			initialUserSelect: currElement.style.userSelect,
		});
		if (computedOverflow === 'auto' || computedOverflow === 'scroll') {
			currElement.style.overflow = 'hidden';
		}
		currElement.style.userSelect = 'none';
		currElement = currElement.parentElement;
	}
	document.documentElement.style.overflow = 'hidden';
	return lockedElements;
};

export const scrollUnlock = (lockedElements: LockedElement[]): void => {
	if (typeof document === 'undefined' || typeof window === 'undefined') {
		return;
	}
	lockedElements.forEach(({ element, initialOverflow, initialUserSelect }) => {
		element.style.overflow = initialOverflow;
		element.style.userSelect = initialUserSelect;
	});
	document.documentElement.style.overflow = 'auto';
};
