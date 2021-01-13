export default <E>(arr: E[][]) => arr.reduce((res, curr) => [...res, ...curr], []);

