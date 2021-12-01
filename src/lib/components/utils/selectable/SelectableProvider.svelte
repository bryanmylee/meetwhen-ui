<script lang="ts" context="module">
	export interface SelectableProviderEvent {
		toggle: {
			id: string;
			selected: boolean;
		};
	}
</script>

<script lang="ts">
	import { Set } from 'immutable';
	import { createEventDispatcher } from 'svelte';
	import { clearAllBodyScrollLocks, disableBodyScroll } from 'body-scroll-lock';
	import { getTouchArray } from '$lib/utils/touch';
	import LongTouchProvider from '$lib/components/utils/long-touch/LongTouchProvider.svelte';
	import { Selecting } from './selecting';
	import { idsWithAddedId, idsWithoutRemovedId } from './utils';

	const dispatch = createEventDispatcher<SelectableProviderEvent>();

	// Main interface of the provider.
	export let selectedIds: string[] = [];

	export let disabled = false;
	export let disabledIds: string[] = [];
	export let isDisabled = (id: string): boolean => disabledIds.includes(id);

	export let interpolateBetween: (startId: string, endId: string) => string[] = undefined;

	export const select = (id: string): void => {
		if (isDisabled(id)) {
			return;
		}
		selectedIds = idsWithAddedId(selectedIds, id);
		dispatch('toggle', { id, selected: true });
	};

	export const deselect = (id: string): void => {
		if (isDisabled(id)) {
			return;
		}
		selectedIds = idsWithoutRemovedId(selectedIds, id);
		dispatch('toggle', { id, selected: false });
	};

	export const toggle = (id: string): void => {
		if (selectedIds.includes(id)) {
			deselect(id);
		} else {
			select(id);
		}
	};

	let startingId: string;
	let selectedSet: Set<string>;
	let selectingSet: Set<string>;
	let effectiveSet: Set<string>;

	export let selecting: Selecting = Selecting.NONE;
	export let selectingIds: string[] = [];
	$: selectingIds = selectingSet?.toArray() ?? [];

	// STARTING SELECTIONS
	const startSelectionFrom = (target: HTMLElement) => {
		if (disabled) {
			return;
		}
		const { id } = target.dataset;
		if (id === undefined || isDisabled(id)) {
			return;
		}
		startingId = id;
		selectedSet = Set(selectedIds);
		selectingSet = Set([id]);
		if (!selectedIds.includes(id)) {
			effectiveSet = selectedSet.union(selectingSet);
			if (selecting === Selecting.NONE) {
				selecting = Selecting.CREATE;
			}
			dispatch('toggle', { id, selected: true });
		} else {
			effectiveSet = selectedSet.subtract(selectingSet);
			if (selecting === Selecting.NONE) {
				selecting = Selecting.DELETE;
			}
			dispatch('toggle', { id, selected: true });
		}
		selectedIds = effectiveSet.toArray();
	};

	const mousestart = ({ target }: MouseEvent) => {
		startSelectionFrom(target as HTMLElement);
	};

	let trackedTouches: Record<number, Touch> = {};

	const longtouchstart = ({ detail }: CustomEvent) => {
		const touchEvent = detail.event as TouchEvent;
		const changedTouches = getTouchArray(touchEvent.changedTouches);
		changedTouches.forEach((touch) => trackTouch(touch, touchEvent));
	};

	const trackTouch = (touch: Touch, { target }: TouchEvent) => {
		trackedTouches[touch.identifier] = touch;
		disableBodyScroll(target as HTMLElement);
		startSelectionFrom(target as HTMLElement);
	};

	// UPDATING SELECTIONS
	const updateSelectionOn = (target: HTMLElement) => {
		if (disabled) {
			return;
		}
		const { id } = target.dataset;
		if (id === undefined || isDisabled(id)) {
			return;
		}
		if (interpolateBetween !== undefined) {
			selectingSet = Set(interpolateBetween(startingId, id));
		} else {
			selectingSet = selectingSet.add(id);
		}
		if (selecting === Selecting.CREATE) {
			effectiveSet = selectedSet.union(selectingSet);
			dispatch('toggle', { id, selected: true });
		} else {
			effectiveSet = selectedSet.subtract(selectingSet);
			dispatch('toggle', { id, selected: false });
		}
		selectedIds = effectiveSet.toArray();
	};

	const mousemoveinto = ({ target }: MouseEvent) => {
		if (selecting === Selecting.NONE) {
			return;
		}
		updateSelectionOn(target as HTMLElement);
	};

	const longtouchmove = ({ detail }: CustomEvent) => {
		const touchEvent = detail.event as TouchEvent;
		const changedTouches = getTouchArray(touchEvent.changedTouches);
		changedTouches.forEach(updateTouch);
	};

	const updateTouch = (touch: Touch) => {
		trackedTouches[touch.identifier] = touch;
		if (selecting === Selecting.NONE) {
			return;
		}
		const target = document.elementFromPoint(touch.clientX, touch.clientY);
		updateSelectionOn(target as HTMLElement);
	};

	// ENDING SELECTIONS
	const endSelection = () => {
		if (disabled) {
			return;
		}
		selectedIds = effectiveSet?.toArray() ?? selectedIds;
		startingId = undefined;
		selectedSet = undefined;
		selectingSet = undefined;
		effectiveSet = undefined;
		selecting = Selecting.NONE;
		trackedTouches = {};
	};

	const longtouchend = ({ detail }: CustomEvent) => {
		const touchEvent = detail.event as TouchEvent;
		const changedTouches = getTouchArray(touchEvent.changedTouches);
		changedTouches.forEach(untrack);
	};

	const untrack = (touch: Touch) => {
		delete trackedTouches[touch.identifier];
		clearAllBodyScrollLocks();
		endSelection();
	};
</script>

<LongTouchProvider
	{disabled}
	on:longtouchstart={longtouchstart}
	on:longtouchmove={longtouchmove}
	on:longtouchend={longtouchend}
>
	<div
		on:mousedown={mousestart}
		on:mousemove={mousemoveinto}
		on:mouseleave={endSelection}
		on:mouseup={endSelection}
		class="contents"
	>
		<slot {selectedIds} {selecting} {selectingIds} {isDisabled} />
	</div>
</LongTouchProvider>
