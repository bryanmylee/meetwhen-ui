<script lang="ts" context="module">
	export interface SelectionProviderEvent {
		toggle: {
			ids: string[];
			lastId: string;
			selected: boolean;
		};
		focusupdate: {
			id: string;
		};
	}
</script>

<!-- 
	@component
	`SelectionProvider` creates a context to manage drag-and-release selection
	logic of child elements. 
	
	Selectable elements must have a data attribute that represents its unique ID
	for selection.

	```
	<SelectableProvider bind:selectedIds>
		<div data-select-id="1" />
		<div data-select-id="2" />
	</SelectableProvider>
	```
	
	The data attribute key can be configured with the `attributeKey` prop.
 -->
<script lang="ts">
	import { Set } from 'immutable';
	import { createEventDispatcher } from 'svelte';
	import { clearAllBodyScrollLocks, disableBodyScroll } from 'body-scroll-lock';
	import {
		getTouchArray,
		LongTouchProvider,
		KeyboardReducer,
	} from '$lib/input';
	import type { Maybe } from '$lib/core/types/Maybe';
	import type { SelectMode } from './SelectMode';
	import type { SelectionInterpolateFn } from './SelectionInterpolateFn';

	const dispatch = createEventDispatcher<SelectionProviderEvent>();

	/**
	 * The main selection interface of selected IDs.
	 *
	 * Bind to this value for reactive state.
	 */
	export let selectedIds: string[] = [];
	$: selectedIdSet = Set(selectedIds);
	$: isIdSelected = (id: string) => selectedIdSet.includes(id);

	/**
	 * The data attribute to read for the selected IDs of child elements.
	 *
	 * Defaults to `selectId`, which translates to `data-select-id`.
	 */
	export let attributeKey = 'selectId';

	/**
	 * The disabled state for the entire selection provider.
	 */
	export let disabled = false;

	/**
	 * IDs to ignore during selection.
	 */
	export let disabledIds: string[] = [];
	$: disabledIdSet = Set(disabledIds);
	$: isIdDisabled = (id: string) => disabledIdSet.includes(id);

	/**
	 * An interpolation function that returns a list of IDs given a start and end
	 * ID.
	 *
	 * If `undefined`, no interpolation between the start and end ID occurs.
	 *
	 * Defaults to `undefined`.
	 */
	export let interpolate: Maybe<SelectionInterpolateFn> = undefined;

	/**
	 * The currently focused ID. Bind to this value for reactive state.
	 *
	 * `currentId` and @see `keyboardReducer` must be provided for keyboard support.
	 *
	 * Defaults to `undefined`.
	 */
	export let currentId: Maybe<string> = undefined;
	$: isIdCurrent = (id: string) => id === currentId;

	/**
	 * A reducer function that returns the next ID given a keyboard event and current ID.
	 *
	 * @see `currentId` and `keyboardReducer` must be provided for keyboard support.
	 *
	 * Single selections are made with `Space` or `Enter`, and long selections
	 * are made by holding `Shift`.
	 *
	 * Defaults to `undefined`.
	 */
	export let keyboardReducer: Maybe<KeyboardReducer<string>> = undefined;

	/**
	 * Programmatically select an ID. This is most useful when integrating
	 * additional selection inputs.
	 *
	 * @param id The ID to select.
	 */
	export const select = (id: string): void => {
		if (isIdDisabled(id)) {
			return;
		}
		selectedIds = Set(selectedIds).add(id).toArray();
		currentId = id;
		dispatch('toggle', { ids: [id], lastId: currentId, selected: true });
	};

	/**
	 * Programmatically deselect an ID. This is most useful when integrating
	 * additional selection inputs.
	 *
	 * @param id The ID to deselect.
	 */
	export const deselect = (id: string): void => {
		if (isIdDisabled(id)) {
			return;
		}
		selectedIds = Set(selectedIds).remove(id).toArray();
		currentId = id;
		dispatch('toggle', { ids: [id], lastId: currentId, selected: false });
	};

	/**
	 * Programmatically toggle the selection of an ID. This is most useful when
	 * integrating additional selection inputs.

	 * @param id The ID to toggle.
	 */
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

	/**
	 * Selections starting on unselected elements will add IDs to the selection,
	 * whereas selections starting on selected elements will remove IDs from the
	 * selection.
	 *
	 * Bind to this value for reactive state.
	 */
	export let selectMode: Maybe<SelectMode> = undefined;

	/**
	 * The IDs in the active selection.
	 */
	export let activeIds: string[] = [];
	$: activeIds = activeIdSet?.toArray() ?? [];
	$: isIdActive = (id: string) => activeIdSet?.includes(id) ?? false;

	// START SELECTION
	// ===============
	// -- mouse
	const mousestart = ({ target }: MouseEvent) => {
		startSelectionFrom(target as HTMLElement);
	};

	// -- touch
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

	// -- keyboard
	const keydown = (event: KeyboardEvent) => {
		if (keyboardReducer === undefined || currentId === undefined) {
			return;
		}
		const nextId = keyboardReducer(event, currentId);
		if (isIdDisabled(nextId)) {
			return;
		}
		// -- start
		if (event.key === ' ' || event.key === 'Enter') {
			toggle(currentId);
		}
		// -- update
		if (event.shiftKey && currentId !== nextId) {
			selectFrom(currentId);
			selectThrough(nextId);
		}
		currentId = nextId;
		dispatch('focusupdate', { id: nextId });
	};

	const startSelectionFrom = (target: HTMLElement) => {
		if (disabled) {
			return;
		}
		const id = target.dataset[attributeKey];
		selectFrom(id);
	};

	/**
	 * Programmatically start a selection. This is most useful when integrating
	 * additional selection inputs.
	 *
	 * @param id The ID to start from.
	 */
	export const selectFrom = (id: Maybe<string>) => {
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
		} else {
			effectiveIdSet = previousIdSet.subtract(activeIdSet);
			if (selectMode === undefined) {
				selectMode = 'remove';
			}
		}
		selectedIds = effectiveIdSet.toArray();
	};

	// UPDATE SELECTION
	// ================
	// -- mouse
	const mousemoveinto = ({ target }: MouseEvent) => {
		if (selectMode === undefined) {
			return;
		}
		updateSelectionOn(target as HTMLElement);
	};

	// -- touch
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

	const updateSelectionOn = (target: HTMLElement) => {
		if (disabled) {
			return;
		}
		const id = target.dataset[attributeKey];
		selectThrough(id);
	};

	/**
	 * Programmatically continue a selection. This is most useful when integrating
	 * additional selection inputs.
	 *
	 * @param id The ID to select through.
	 */
	export const selectThrough = (id: Maybe<string>) => {
		if (id === undefined || isIdDisabled(id)) {
			return;
		}
		currentId = id;
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
		} else {
			effectiveIdSet = previousIdSet?.subtract(activeIdSet);
		}
		selectedIds = effectiveIdSet?.toArray() ?? [];
	};

	// END SELECTION
	// =============
	// -- mouse
	const mouseup = ({ target }: MouseEvent) => {
		endSelectionOn(target as HTMLElement);
	};

	// -- touch
	const longtouchend = ({ detail }: CustomEvent) => {
		const touchEvent = detail.event as TouchEvent;
		const changedTouches = getTouchArray(touchEvent.changedTouches);
		changedTouches.forEach(untrack);
	};

	const untrack = (touch: Touch) => {
		delete trackedTouches[touch.identifier];
		clearAllBodyScrollLocks();
		const target = document.elementFromPoint(touch.clientX, touch.clientY);
		endSelectionOn(target as HTMLElement);
	};

	// -- keyboard
	const keyup = (event: KeyboardEvent) => {
		if (event.key === 'Shift') {
			selectEnd(currentId);
		}
	};

	const endSelectionOn = (target?: HTMLElement) => {
		if (disabled) {
			return;
		}
		currentId = target?.dataset[attributeKey] ?? currentId;
		selectEnd(currentId);
	};

	const selectEnd = (id: Maybe<string>) => {
		selectedIds = effectiveIdSet?.toArray() ?? selectedIds;
		if (activeIdSet !== undefined && id !== undefined) {
			dispatch('toggle', {
				ids: activeIdSet.toArray(),
				lastId: id,
				selected: selectMode === 'add',
			});
		}
		startingId = undefined;
		previousIdSet = undefined;
		activeIdSet = undefined;
		effectiveIdSet = undefined;
		selectMode = undefined;
		trackedTouches = {};
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
		on:mouseup={mouseup}
		on:mouseleave={() => endSelectionOn()}
		on:keydown={keydown}
		on:keyup={keyup}
		class="contents"
	>
		<slot
			{selectMode}
			{selectedIds}
			{isIdSelected}
			{disabledIds}
			{isIdDisabled}
			{currentId}
			{isIdCurrent}
			{activeIds}
			{isIdActive}
		/>
	</div>
</LongTouchProvider>
