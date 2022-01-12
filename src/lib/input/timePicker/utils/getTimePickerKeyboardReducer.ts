import type { Set } from 'immutable';
import type { KeyboardReducer } from '$lib/input';
import { dateToId } from '$lib/core/utils/dayjs/dateIds';
import {
	dateTimeDecomposeId,
	dateTimeFromId,
} from '$lib/core/utils/dayjs/dateTimeIds';
import type { Dayjs } from 'dayjs';
import { onDay } from '$lib/core/utils/dayjs/onDay';
import { timeFromId } from '$lib/core/utils/dayjs/timeIds';
import type { Maybe } from '$lib/core/types/Maybe';

export type GetTimePickerKeyboardReducer = (
	dates: Dayjs[],
	validIdSet: Set<string>,
) => KeyboardReducer<string>;

export const getTimePickerKeyboardReducer: GetTimePickerKeyboardReducer =
	(dates, validIdSet) => (event, currentId) => {
		switch (event.key) {
			case 'ArrowLeft':
				return goLeft(currentId, validIdSet, dates);
			case 'ArrowRight':
				return goRight(currentId, validIdSet, dates);
			case 'ArrowUp':
				return goUp(currentId, validIdSet);
			case 'ArrowDown':
				return goDown(currentId, validIdSet);
			default:
				return currentId;
		}
	};

const getClosestTimeId = (
	fromId: string,
	onDateId: string,
	validIdSet: Set<string>,
	allowedDiff?: (diff: number) => boolean,
): Maybe<string> => {
	return validIdSet
		.filter((id) => dateTimeDecomposeId(id)[0] === onDateId)
		.map((id) => getTimeDiff(id, fromId))
		.filter(([, diff]) => allowedDiff === undefined || allowedDiff(diff))
		.map(([dateTimeId, diff]) => [dateTimeId, Math.abs(diff)] as const)
		.min((a, b) => a[1] - b[1])?.[0];
};

const getTimeDiff = (
	dateTimeId: string,
	currDateTimeId: string,
): [dateTimeId: string, diff: number] => {
	const [, timeId] = dateTimeDecomposeId(dateTimeId);
	const currDateTime = dateTimeFromId(currDateTimeId);
	const diff = onDay(timeFromId(timeId), currDateTime).diff(currDateTime);
	return [dateTimeId, diff];
};

const goLeft = (
	currentId: string,
	validIdSet: Set<string>,
	dates: Dayjs[],
): string => {
	const [currentDateId] = dateTimeDecomposeId(currentId);
	const currDateIndex = dates.findIndex(
		(date) => dateToId(date) === currentDateId,
	);
	if (currDateIndex === 0) {
		return currentId;
	}
	const nextDateId = dateToId(dates[currDateIndex - 1]);
	const nextId = getClosestTimeId(currentId, nextDateId, validIdSet);
	return nextId ?? currentId;
};

const goRight = (
	currentId: string,
	validIdSet: Set<string>,
	dates: Dayjs[],
): string => {
	const [currentDateId] = dateTimeDecomposeId(currentId);
	const currDateIndex = dates.findIndex(
		(date) => dateToId(date) === currentDateId,
	);
	if (currDateIndex === dates.length - 1) {
		return currentId;
	}
	const nextDateId = dateToId(dates[currDateIndex + 1]);
	const nextId = getClosestTimeId(currentId, nextDateId, validIdSet);
	return nextId ?? currentId;
};

const goUp = (currentId: string, validIdSet: Set<string>): string => {
	const [currentDateId] = dateTimeDecomposeId(currentId);
	const nextId = getClosestTimeId(
		currentId,
		currentDateId,
		validIdSet,
		(diff) => diff < 0,
	);
	return nextId ?? currentId;
};

const goDown = (currentId: string, validIdSet: Set<string>): string => {
	const [currentDateId] = dateTimeDecomposeId(currentId);
	const nextId = getClosestTimeId(
		currentId,
		currentDateId,
		validIdSet,
		(diff) => diff > 0,
	);
	return nextId ?? currentId;
};
