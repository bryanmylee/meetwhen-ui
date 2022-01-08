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
	$: helpId = `${id}-help`;
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
	aria-label="date picker, {$currentDate.format('MMMM YYYY')}"
	class="date-picker"
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
		<ul id={helpId} tabindex={0} class="help-message focus">
			<li><strong>Cursor keys</strong> to navigate dates.</li>
			<li><strong>Space</strong> to toggle date.</li>
			<li>Hold <strong>Shift</strong> to select multiple dates.</li>
		</ul>
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
	<p id={errorId} class="error-message" for={id} role="status">
		{error}&nbsp;
	</p>
</div>

<style lang="postcss">
	.date-picker {
		@apply bg-neutral-100 gdark:bg-neutral-700;
		@apply p-4 pb-1 rounded-xl;

		&.error {
			@apply ring ring-red-400;
		}

		& .help-message {
			&:not(:focus) {
				@apply aria-only;
			}
			&:focus {
				@apply outline-none;
			}
			@apply absolute left-0 top-0 w-fit z-10;
			@apply p-4 rounded-xl shadow-lg;
			@apply bg-white gdark:bg-neutral-600;
		}

		& > .error-message {
			@apply text-center text-red-400 text-xs italic;
			@apply select-none pointer-events-none;
		}
	}
</style>
