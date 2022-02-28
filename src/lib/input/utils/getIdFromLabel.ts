export const getIdFromLabel = (label: string): string =>
	label.toLowerCase().replace(/\s/g, '-');
