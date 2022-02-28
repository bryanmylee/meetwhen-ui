export const arrayEquals = <T>(
	arr1: T[],
	arr2: T[],
	isElementEqual: (a: T, b: T) => boolean = (a, b) => a === b,
): boolean => {
	if (arr1.length !== arr2.length) {
		return false;
	}
	for (let i = 0; i < arr1.length; i++) {
		if (!isElementEqual(arr1[i], arr2[i])) {
			return false;
		}
	}
	return true;
};
