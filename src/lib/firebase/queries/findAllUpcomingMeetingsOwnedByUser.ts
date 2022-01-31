import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { writable } from 'svelte/store';
import type { Readable } from 'svelte/store';
import {
	collection,
	getDocs,
	limit as limitAs,
	orderBy,
	query,
	QuerySnapshot,
	startAfter,
	startAt,
	where,
} from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import type { Id } from '$lib/core/types/Id';
import { MeetingConverter } from '$lib/models/Meeting';
import type { Meeting, MeetingData } from '$lib/models/Meeting';
import { getTotalInterval } from '$lib/core/utils/intervals';

export interface FindAllUpcomingMeetingsOwnedByUserProps {
	now?: Dayjs;
	limit?: number;
	atEnd?: Dayjs;
	afterEnd?: Dayjs;
}

export const findAllUpcomingMeetingsOwnedByUser = async (
	repo: Firestore,
	userId: string,
	{
		now = dayjs(),
		limit = 5,
		atEnd,
		afterEnd,
	}: FindAllUpcomingMeetingsOwnedByUserProps = {},
): Promise<Id<Meeting>[]> => {
	const constraits = [
		where('ownerId', '==', userId),
		where('total.end', '>=', now.unix()),
		orderBy('total.end', 'asc'),
		limitAs(limit),
	];
	if (atEnd !== undefined && afterEnd !== undefined) {
		throw new Error('Cannot paginate with both `atEnd` and `afterEnd`');
	}
	if (atEnd !== undefined) {
		constraits.push(startAt(atEnd.unix()));
	} else if (afterEnd !== undefined) {
		constraits.push(startAfter(afterEnd.unix()));
	}
	const meetingSnapshot = (await getDocs(
		query(collection(repo, 'meetings'), ...constraits),
	)) as QuerySnapshot<MeetingData>;
	return meetingSnapshot.docs
		.map((doc) => [doc.id, doc.data()] as const)
		.map(([id, data]) => ({ ...MeetingConverter.parse(data), id }));
};

interface UseAllUpcomingMeetingsState {
	currentPageIndex: number;
	page: Record<
		number,
		| {
				isLoading: true;
				isEnd: boolean;
				meetings: undefined;
		  }
		| {
				isLoading: false;
				isEnd: boolean;
				meetings: Id<Meeting>[];
		  }
	>;
}

export interface UpcomingMeetings
	extends Readable<UseAllUpcomingMeetingsState> {
	nextPage: () => void;
	previousPage: () => void;
}

export const useAllUpcomingMeetingsOwnedByUser = (
	repo: Firestore,
	userId: string,
): UpcomingMeetings => {
	const state = writable<UseAllUpcomingMeetingsState>({
		currentPageIndex: 0,
		page: {
			0: {
				isLoading: true,
				isEnd: false,
				meetings: undefined,
			},
		},
	});

	findAllUpcomingMeetingsOwnedByUser(repo, userId).then((meetings) => {
		state.update(($stateAfterLoad) => ({
			...$stateAfterLoad,
			page: {
				...$stateAfterLoad.page,
				0: {
					isLoading: false,
					isEnd: false,
					meetings,
				},
			},
		}));
	});

	const nextPage = () => {
		state.update(($state) => {
			const nextPageIndex = $state.currentPageIndex + 1;
			if ($state.page[nextPageIndex] !== undefined) {
				return {
					...$state,
					currentPageIndex: nextPageIndex,
				};
			}

			const currentPage = $state.page[$state.currentPageIndex];
			if (
				currentPage.isLoading ||
				currentPage.isEnd ||
				currentPage.meetings === undefined ||
				currentPage.meetings.length === 0
			) {
				return $state;
			}
			const lastMeeting = currentPage.meetings[currentPage.meetings.length - 1];
			const lastTotalInterval = getTotalInterval(lastMeeting.intervals);

			findAllUpcomingMeetingsOwnedByUser(repo, userId, {
				afterEnd: lastTotalInterval.end,
			}).then((nextMeetings) => {
				// asynchronously update state again after data is fetched.
				state.update(($stateAfterLoad) => ({
					...$stateAfterLoad,
					page: {
						...$stateAfterLoad.page,
						[nextPageIndex]: {
							isLoading: false,
							isEnd: false,
							meetings: nextMeetings,
						},
					},
				}));
			});

			return {
				currentPageIndex: nextPageIndex,
				page: {
					...$state.page,
					[nextPageIndex]: {
						isLoading: true,
						isEnd: false,
						meetings: undefined,
					},
				},
			};
		});
	};

	const previousPage = () => {
		state.update(($state) => {
			if ($state.currentPageIndex === 0) {
				return $state;
			}
			const previousPageIndex = $state.currentPageIndex - 1;
			return {
				...$state,
				currentPageIndex: previousPageIndex,
			};
		});
	};

	return {
		subscribe: state.subscribe,
		nextPage,
		previousPage,
	};
};
