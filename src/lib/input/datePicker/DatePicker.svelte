<script lang="ts">
	import { tick } from 'svelte';
	import { writable } from 'svelte/store';
	import dayjs from 'dayjs';
	import type { Dayjs } from 'dayjs';
	import { Set } from 'immutable';
	import { nanoid } from 'nanoid';
	import type { Maybe } from '$lib/core/types/Maybe';
	import { bound } from '$lib/core/utils/bound';
	import { SelectionProvider } from '$lib/input';
	import { dateFromId, dateToId } from './utils/dateIds';
	import { getDatePickerState } from './utils/getDatePickerState';
	import { datePickerHasNeighbours } from './utils/datePickerHasNeighbours';
	import { datePickerKeyboardReducer } from './utils/datePickerKeyboardReducer';
	import { setCurrentDateElement } from './utils/datePickerContext';
	import MonthPicker from './atoms/MonthPicker.svelte';
	import DateGridItem from './atoms/DateGridItem.svelte';
	import WeekDaysHeader from './atoms/WeekDaysHeader.svelte';

	export let id: string = nanoid(8);
	$: errorId = `${id}-error`;

	export let initDate = dayjs();
	const currentDate = writable<Dayjs>(initDate);
	const currentId = bound(currentDate, dateToId, dateFromId);
	const { weekDays, monthDates, disabledDates } =
		getDatePickerState(currentDate);

	let selectedDates: Dayjs[] = [];
	export { selectedDates as value };
	/**
	 * SelectionProvider binding.
	 */
	let selectedIds: string[] = selectedDates.map(dateToId);
	$: selectedDates = selectedIds.map(dateFromId);
	$: selectedIdSet = Set(selectedIds);

	export let error = '';

	const currentDateElement = writable<Maybe<HTMLButtonElement>>();
	setCurrentDateElement(currentDateElement);

	const handleFocusUpdate = async () => {
		await tick();
		$currentDateElement?.focus();
	};
</script>

<div
	{id}
	tabindex={0}
	aria-label={$currentDate.format('MMMM YYYY')}
	class="date-picker focus"
	class:error={error !== ''}
>
	<MonthPicker bind:month={$currentDate} />
	<WeekDaysHeader weekDays={$weekDays} />
	<div
		role="grid"
		aria-describedby={errorId}
		aria-multiselectable={true}
		class="relative grid grid-cols-7"
	>
		<div tabindex={0} class="help-message focus">
			<p><strong>Cursor keys</strong> to navigate dates.</p>
			<p><strong>Space</strong> to toggle date.</p>
			<p>Hold <strong>Shift</strong> to select multiple dates.</p>
			<p>Hold <strong>Ctrl + Shift</strong> to unselect multiple dates.</p>
			<p><strong>Tab</strong> to continue.</p>
		</div>
		<SelectionProvider
			bind:selectedIds
			bind:currentId={$currentId}
			disabledIds={$disabledDates.map(dateToId)}
			keyboardReducer={datePickerKeyboardReducer}
			on:focusupdate={handleFocusUpdate}
			let:isIdSelected
			let:isIdDisabled
			let:isIdCurrent
			let:selectMode
		>
			{#each $monthDates as date (dateToId(date))}
				<DateGridItem
					{date}
					selected={isIdSelected(dateToId(date))}
					disabled={isIdDisabled(dateToId(date))}
					current={isIdCurrent(dateToId(date))}
					{selectMode}
					neighbours={datePickerHasNeighbours(date, selectedIdSet)}
				/>
			{/each}
		</SelectionProvider>
	</div>
	<p id={errorId} role="status" class="error-message">
		{error}&nbsp;
	</p>
</div>

<style lang="postcss">
	.date-picker {
		@apply bg-shade-100;
		@apply p-4 pb-1 rounded-xl;

		&.error {
			@apply ring ring-red-400;
		}

		& .help-message {
			@apply focus-only absolute left-2 top-2 w-fit z-20;
			@apply p-2 rounded-lg shadow-lg text-xs;
			@apply bg-shade-50;
		}

		& > .error-message {
			@apply text-center text-red-400 text-xs italic;
			@apply select-none pointer-events-none;
		}
	}
</style>
