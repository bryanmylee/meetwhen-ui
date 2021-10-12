interface GroupedByIdOptions<K, V> {
	getKey: (item: V) => K;
	keyEqual?: (lhs: K, rhs: K) => boolean;
}

export const entriesById = <K, V>(
	items: V[],
	{ getKey, keyEqual }: GroupedByIdOptions<K, V>
): [key: K, items: V[]][] => {
	if (keyEqual === undefined) {
		keyEqual = (a, b) => a === b;
	}
	const entries: [key: K, items: V[]][] = [];
	items.forEach((item) => {
		const key = getKey(item);
		const matchedEntry = entries.find(([entryKey]) => keyEqual(key, entryKey));
		if (matchedEntry === undefined) {
			entries.push([key, [item]]);
		} else {
			matchedEntry[1].push(item);
		}
	});
	return entries;
};
