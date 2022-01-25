<script lang="ts">
	import { tick } from 'svelte';
	import { writable } from 'svelte/store';
	import dayjs from 'dayjs';
	import type { Dayjs } from 'dayjs';
	import { Set } from 'immutable';
	import { nanoid } from 'nanoid';
	import type { HTMLActionArray } from '@rgossiaux/svelte-headlessui/hooks/use-actions';
	import { useActions } from '$lib/core/utils/useActions';
	import type { Maybe } from '$lib/core/types/Maybe';
	import { bound } from '$lib/core/utils/bound';
	import { SelectionProvider, KeyboardHelp } from '$lib/input';
	import { dateFromId, dateToId } from '$lib/core/utils/dayjs/dateIds';
	import { createDatePickerState } from './utils/createDatePickerState';
	import { datePickerHasNeighbors } from './utils/datePickerHasNeighbors';
	import { datePickerKeyboardReducer } from './utils/datePickerKeyboardReducer';
	import { setCurrentDateElement } from './utils/datePickerContext';
	import MonthPicker from './atoms/MonthPicker.svelte';
	import DateGridItem from './atoms/DateGridItem.svelte';
	import WeekDaysHeader from './atoms/WeekDaysHeader.svelte';

	export let id: string = nanoid(8);
	$: errorId = `${id}-error`;

	let initDate = dayjs();
	export { initDate as focusedDate };
	const [controls, state] = createDatePickerState({ initDate });
	const { currentDate } = controls;
	$: $currentDate = initDate;
	/**
	 * SelectionProvider currentId binding.
	 */
	const currentId = bound(currentDate, dateToId, dateFromId);
	const { weekDays, monthDates, disabledDates } = state;
	$: disabledIds = Set($disabledDates.map(dateToId));

	let selectedDates: Dayjs[] = [];
	export { selectedDates as value };
	/**
	 * SelectionProvider selectedIds binding.
	 */
	let selectedIds = Set(selectedDates.map(dateToId));
	$: selectedDates = selectedIds.toArray().map(dateFromId);

	export let error = '';

	const currentDateElement = writable<Maybe<HTMLButtonElement>>();
	setCurrentDateElement(currentDateElement);

	const handleFocusUpdate = async () => {
		await tick();
		$currentDateElement?.focus();
	};

	export let use: HTMLActionArray = [];
</script>

<div
	use:useActions={use}
	{id}
	tabindex={0}
	aria-label={$currentDate.format('MMMM YYYY')}
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
		<KeyboardHelp />
		<SelectionProvider
			bind:selectedIds
			bind:currentId={$currentId}
			{disabledIds}
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
					neighbors={datePickerHasNeighbors(date, selectedIds)}
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
		@apply bg-shade-100 focus;
		@apply p-4 pb-1 rounded-xl;

		&.error {
			@apply ring ring-red-400;
		}

		& > .error-message {
			@apply text-center text-red-400 text-error;
			@apply select-none pointer-events-none;
		}
	}
</style>
