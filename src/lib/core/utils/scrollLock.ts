export const scrollLock = (): void => {
	if (typeof document === 'undefined' || typeof window === 'undefined') {
		return;
	}
	document.documentElement.style.overflow = 'hidden';
};

export const scrollUnlock = (): void => {
	if (typeof document === 'undefined' || typeof window === 'undefined') {
		return;
	}
	document.documentElement.style.overflow = 'auto';
};
