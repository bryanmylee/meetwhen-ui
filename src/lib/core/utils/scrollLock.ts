export const scrollLock = (): number => {
	if (typeof document === 'undefined' || typeof window === 'undefined') {
		return 0;
	}
	const htmlElement = document.querySelector('html');
	if (htmlElement !== null) {
		htmlElement.style.scrollBehavior = 'unset';
	}
	const scrollY = window.scrollY;
	document.body.style.position = 'fixed';
	document.body.style.top = `-${scrollY}px`;
	return scrollY;
};

export const scrollUnlock = (prevScrollY: number): void => {
	if (typeof document === 'undefined' || typeof window === 'undefined') {
		return;
	}
	document.body.style.position = '';
	document.body.style.top = '';
	window.scrollTo(0, prevScrollY);
	const htmlElement = document.querySelector('html');
	if (htmlElement !== null) {
		htmlElement.style.scrollBehavior = 'smooth';
	}
};
