export const flat = <E>(arr: E[][]): E[] => arr.reduce((res, curr) => [...res, ...curr], []);
