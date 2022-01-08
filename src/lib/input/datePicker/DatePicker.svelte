<script lang="ts">
	import { tick } from 'svelte';
	import { writable } from 'svelte/store';
	import dayjs from 'dayjs';
	import type { Dayjs } from 'dayjs';
	import { Set } from 'immutable';
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

<div class="date-picker">
	<MonthPicker bind:month={$currentDate} />
	<div class="grid grid-cols-7">
		{#each $weekDays as day}
			<div class="p-2 text-center">
				{day.format('ddd')}
			</div>
		{/each}
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
		<div class="grid grid-cols-7" role="grid">
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
		</div>
	</SelectionProvider>
</div>

<style lang="postcss">
	.date-picker {
		@apply bg-neutral-100 gdark:bg-neutral-700;
		@apply p-2 rounded-xl;
	}
</style>
