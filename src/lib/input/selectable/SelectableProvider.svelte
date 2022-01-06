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
	import { getTouchArray, LongTouchProvider } from '$lib/core/utils/touch';
	import type { SelectMode } from './SelectMode';
	import type { SelectableInterpolateFn } from './SelectableInterpolateFn';
	import type { Maybe } from '$lib/core/types/Maybe';

	const dispatch = createEventDispatcher<SelectableProviderEvent>();

	/**
	 * The main selectable interface.
	 * Selectable elements must have a `data-id` attribute.
	 */
	export let selectedIds: string[] = [];
	$: selectedIdSet = Set(selectedIds);
	$: isIdSelected = (id: string) => selectedIdSet.includes(id);

	export let disabled = false;
	export let disabledIds: string[] = [];
	$: disabledIdSet = Set(disabledIds);
	$: isIdDisabled = (id: string) => disabledIdSet.includes(id);

	export let interpolate: Maybe<SelectableInterpolateFn> = undefined;

	export const select = (id: string): void => {
		if (isIdDisabled(id)) {
			return;
		}
		selectedIds = Set(selectedIds).add(id).toArray();
		dispatch('toggle', { id, selected: true });
	};

	export const deselect = (id: string): void => {
		if (isIdDisabled(id)) {
			return;
		}
		selectedIds = Set(selectedIds).remove(id).toArray();
		dispatch('toggle', { id, selected: false });
	};

	export const toggle = (id: string): void => {
		if (isIdSelected(id)) {
			deselect(id);
		} else {
			select(id);
		}
	};

	let startingId: Maybe<string>;
	let previousIdSet: Maybe<Set<string>>;
	let activeIdSet: Maybe<Set<string>>;
	let effectiveIdSet: Maybe<Set<string>>;

	export let selectMode: Maybe<SelectMode> = undefined;
	export let activeIds: string[] = [];
	$: activeIds = activeIdSet?.toArray() ?? [];
	$: isIdActive = (id: string) => activeIdSet?.includes(id) ?? false;

	// STARTING SELECTIONS
	const startSelectionFrom = (target: HTMLElement) => {
		if (disabled) {
			return;
		}
		const { id } = target.dataset;
		if (id === undefined || isIdDisabled(id)) {
			return;
		}
		startingId = id;
		previousIdSet = Set(selectedIds);
		activeIdSet = Set([id]);
		if (!isIdSelected(id)) {
			effectiveIdSet = previousIdSet.union(activeIdSet);
			if (selectMode === undefined) {
				selectMode = 'add';
			}
			dispatch('toggle', { id, selected: true });
		} else {
			effectiveIdSet = previousIdSet.subtract(activeIdSet);
			if (selectMode === undefined) {
				selectMode = 'remove';
			}
			dispatch('toggle', { id, selected: true });
		}
		selectedIds = effectiveIdSet.toArray();
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
		if (id === undefined || isIdDisabled(id)) {
			return;
		}
		if (interpolate !== undefined && startingId !== undefined) {
			activeIdSet = Set(interpolate(startingId, id));
		} else {
			activeIdSet = activeIdSet?.add(id);
		}
		if (activeIdSet === undefined) {
			return;
		}
		if (selectMode === 'add') {
			effectiveIdSet = previousIdSet?.union(activeIdSet);
			dispatch('toggle', { id, selected: true });
		} else {
			effectiveIdSet = previousIdSet?.subtract(activeIdSet);
			dispatch('toggle', { id, selected: false });
		}
		selectedIds = effectiveIdSet?.toArray() ?? [];
	};

	const mousemoveinto = ({ target }: MouseEvent) => {
		if (selectMode === undefined) {
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
		if (selectMode === undefined) {
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
		selectedIds = effectiveIdSet?.toArray() ?? selectedIds;
		startingId = undefined;
		previousIdSet = undefined;
		activeIdSet = undefined;
		effectiveIdSet = undefined;
		selectMode = undefined;
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
		<slot
			{selectMode}
			{selectedIds}
			{isIdSelected}
			{disabledIds}
			{isIdDisabled}
			{activeIds}
			{isIdActive}
		/>
	</div>
</LongTouchProvider>
