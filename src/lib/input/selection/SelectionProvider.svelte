<script lang="ts" context="module">
	export interface SelectionProviderEvent {
		selectstart: {
			selectMode: SelectMode;
			id: string;
		};
		selectthrough: {
			selectMode: SelectMode;
			startingId?: string;
			id: string;
		};
		selectend: {
			selectMode: SelectMode;
			ids: string[];
			id: string;
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
	import {
		getTouchArray,
		LongTouchProvider,
		KeyboardReducer,
	} from '$lib/input';
	import type { Maybe } from '$lib/core/types/Maybe';
	import type { SelectMode } from './SelectMode';
	import type { SelectionInterpolateFn } from './SelectionInterpolateFn';
	import { scrollLock, scrollUnlock } from '$lib/core/utils/scrollLock';

	const dispatch = createEventDispatcher<SelectionProviderEvent>();

	/**
	 * The main selection interface of selected IDs.
	 *
	 * Bind to this value for reactive state.
	 */
	export let selectedIds = Set<string>();
	$: isIdSelected = (id: string) => selectedIds.includes(id);

	/**
	 * If lazy is enabled, selectedIds will only be updated on selectEnd.
	 *
	 * This is useful if updating selectedIds is computationally expensive.
	 */
	export let lazy = false;

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
	export let disabledIds = Set<string>();
	$: isIdDisabled = (id: string) => disabledIds.includes(id);

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
		selectedIds = selectedIds.add(id);
		currentId = id;
		dispatch('selectstart', { id: currentId, selectMode: 'add' });
		dispatch('selectend', { ids: [id], id: currentId, selectMode: 'add' });
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
		selectedIds = selectedIds.remove(id);
		currentId = id;
		dispatch('selectstart', { id: currentId, selectMode: 'remove' });
		dispatch('selectend', { ids: [id], id: currentId, selectMode: 'remove' });
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
	let previousIds: Maybe<Set<string>>;
	let effectiveIds: Maybe<Set<string>>;

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
	export let activeIds = Set<string>();
	$: isIdActive = (id: string) => activeIds.includes(id);

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
		scrollLock();

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
		if (nextId !== currentId) {
			event.preventDefault();
		}
		// -- start
		if (event.key === ' ' || event.key === 'Enter') {
			toggle(currentId);
		}
		// -- update
		if (event.shiftKey && currentId !== nextId) {
			if (selectMode === undefined) {
				selectFrom(currentId, event.ctrlKey ? 'remove' : 'add');
			}
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
	export const selectFrom = (
		id: Maybe<string>,
		forceSelectMode?: SelectMode,
	): void => {
		if (id === undefined || isIdDisabled(id)) {
			return;
		}
		currentId = id;
		startingId = id;
		previousIds = selectedIds;
		activeIds = Set([id]);

		selectMode = forceSelectMode ?? (isIdSelected(id) ? 'remove' : 'add');
		if (selectMode === 'add') {
			effectiveIds = previousIds.union(activeIds);
		} else {
			effectiveIds = previousIds.subtract(activeIds);
		}
		dispatch('selectstart', { selectMode, id });
		if (!lazy) {
			selectedIds = effectiveIds;
		}
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

	let previousTarget: Maybe<HTMLElement>;
	const updateSelectionOn = (target: HTMLElement) => {
		if (disabled || previousTarget === target) {
			return;
		}
		previousTarget = target;
		const id = target.dataset[attributeKey];
		selectThrough(id);
	};

	/**
	 * Programmatically continue a selection. This is most useful when integrating
	 * additional selection inputs.
	 *
	 * @param id The ID to select through.
	 */
	export const selectThrough = (id: Maybe<string>): void => {
		if (id === undefined || isIdDisabled(id) || selectMode === undefined) {
			return;
		}
		currentId = id;
		if (interpolate !== undefined && startingId !== undefined) {
			activeIds = Set(interpolate(startingId, id));
		} else {
			activeIds = activeIds.add(id);
		}
		if (activeIds === undefined) {
			return;
		}
		if (selectMode === 'add') {
			effectiveIds = previousIds?.union(activeIds);
		} else {
			effectiveIds = previousIds?.subtract(activeIds);
		}
		dispatch('selectthrough', { selectMode, startingId, id });
		if (!lazy) {
			selectedIds = effectiveIds ?? Set();
		}
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
		scrollUnlock();
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
		if (disabled || selectMode === undefined) {
			return;
		}
		previousTarget = undefined;
		currentId = target?.dataset[attributeKey] ?? currentId;
		selectEnd(currentId);
	};

	const selectEnd = (id: Maybe<string>) => {
		selectedIds = effectiveIds ?? selectedIds;
		if (id !== undefined && selectMode !== undefined) {
			dispatch('selectend', {
				ids: activeIds.toArray(),
				id,
				selectMode,
			});
		}
		startingId = undefined;
		previousIds = undefined;
		activeIds = Set();
		effectiveIds = undefined;
		trackedTouches = {};
		selectMode = undefined;
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
