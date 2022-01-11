export const timePickerToId = ([dateId, timeId]: [string, string]): string =>
	`${dateId}T${timeId}`;

export const timePickerFromId = (
	id: string,
): [dateId: string, timeId: string] => id.split('T') as [string, string];
