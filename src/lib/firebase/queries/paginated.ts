/* eslint-disable @typescript-eslint/no-empty-function */
import type { Maybe } from '$lib/core/types/Maybe';
import { derived, writable } from 'svelte/store';
import type { Readable } from 'svelte/store';

export type Page<Data> =
	| {
			index: number;
			isLoading: true;
	  }
	| {
			index: number;
			isLoading: false;
			isLast: boolean;
			data: Data[];
	  };

export interface PaginatedState<Data> {
	currentIndex: number;
	pages: {
		0: Page<Data>;
		[pageIndex: number]: Maybe<Page<Data>>;
	};
}

export type GetData<Data> = (
	pageSize: number,
	previous?: Data[],
) => Promise<Data[]>;

export interface Paginated<Data> extends Readable<Page<Data>> {
	nextPage: () => void;
	previousPage: () => void;
}

export interface UsePaginatedProps {
	pageSize?: number;
}

export const usePaginated = <Data>(
	getData: GetData<Data>,
	{ pageSize = 5 }: UsePaginatedProps = {},
): Paginated<Data> => {
	const state = writable<PaginatedState<Data>>({
		currentIndex: 0,
		pages: {
			0: {
				index: 0,
				isLoading: true,
			},
		},
	});

	const loadIndexUpdater =
		(index: number, updateCurrentIndex = false) =>
		($state: PaginatedState<Data>): PaginatedState<Data> => {
			const pageToLoad = $state.pages[index];
			if (pageToLoad !== undefined) {
				return {
					...$state,
					currentIndex: updateCurrentIndex ? index : $state.currentIndex,
				};
			}
			fetchIndexData($state, index);
			return {
				...$state,
				currentIndex: updateCurrentIndex ? index : $state.currentIndex,
				pages: {
					...$state.pages,
					[index]: {
						index,
						isLoading: true,
					},
				},
			};
		};

	const fetchIndexData = async (
		previousState: PaginatedState<Data>,
		index: number,
	) => {
		let data: Data[];
		if (index === 0) {
			data = await getData(pageSize + 1);
		} else {
			const previousPage = previousState.pages[index - 1];
			if (previousPage === undefined || previousPage.isLoading) {
				return;
			}
			data = await getData(pageSize + 1, previousPage.data);
		}
		// query for n + 1 items, and pass n to updater.
		// if the item at n + 1 does not exist, then this must be the last page.
		updateIndexWithData(index, data.slice(0, pageSize));
		if (data.length < pageSize + 1) {
			setPageIsLast(index);
		}
	};

	const updateIndexWithData = (index: number, data: Data[]) => {
		state.update(($state) => {
			const pageToUpdate = $state.pages[index];
			if (pageToUpdate === undefined) {
				return $state;
			}
			return {
				...$state,
				pages: {
					...$state.pages,
					[index]: {
						index,
						isLoading: false,
						isLast: false,
						data,
					},
				},
			};
		});
	};

	const setPageIsLast = (index: number) => {
		state.update(($state) => {
			const page = $state.pages[index];
			if (page === undefined || page.isLoading) {
				return $state;
			}
			return {
				...$state,
				pages: {
					...$state.pages,
					[index]: {
						...page,
						isLast: true,
					},
				},
			};
		});
	};

	// Manually load the first page.
	state.update(($state) => {
		fetchIndexData($state, 0);
		return $state;
	});

	const currentPage = derived(state, ($state) => {
		const $currentPage = $state.pages[$state.currentIndex];
		if ($currentPage !== undefined) {
			return $currentPage;
		}
		return $state.pages[0];
	});

	const nextPage = () => {
		state.update(($state) => {
			const currentPage = $state.pages[$state.currentIndex];
			if (
				currentPage === undefined ||
				currentPage.isLoading ||
				currentPage.isLast
			) {
				return $state;
			}
			return loadIndexUpdater($state.currentIndex + 1, true)($state);
		});
	};

	const previousPage = () => {
		state.update(($state) => {
			return {
				...$state,
				currentIndex: Math.max($state.currentIndex - 1, 0),
			};
		});
	};

	return {
		subscribe: currentPage.subscribe,
		nextPage,
		previousPage,
	};
};
