export const zip = <T1, T2>(arr1: T1[], arr2: T2[]): [T1, T2][] => {
	const result: [T1, T2][] = [];
	const minLength = Math.min(arr1.length, arr2.length);
	let index = 0;
	for (; index < minLength; index++) {
		result.push([arr1[index], arr2[index]]);
	}
	for (; index < arr1.length; index++) {
		result.push([arr1[index], null]);
	}
	for (; index < arr2.length; index++) {
		result.push([null, arr2[index]]);
	}
	return result;
};
