<script lang="ts">
	import { tick } from 'svelte';
	import { writable } from 'svelte/store';
	import dayjs from 'dayjs';
	import type { Dayjs } from 'dayjs';
	import type { Maybe } from '$lib/core/types/Maybe';
	import { dateFromId, dateToId } from './utils/dateIds';
	import { getDatePickerState } from './utils/getDatePickerState';
	import { getHasSelectedNeighbors } from './utils/getHasSelectedNeighbors';
	import { datePickerKeyboardReducer } from './utils/datePickerKeyboardReducer';
	import { setCurrentDateElement } from './utils/context';
	import { SelectionProvider, SelectionProviderEvent } from '..';
	import MonthPicker from './atoms/MonthPicker.svelte';
	import DateGridItem from './atoms/DateGridItem.svelte';
	import { bound } from '$lib/core/utils/bound';

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

	let selector: Maybe<SelectionProvider>;
	const currentDateElement = writable<Maybe<HTMLButtonElement>>();
	setCurrentDateElement(currentDateElement);
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
		bind:this={selector}
		bind:selectedIds
		bind:currentId={$currentId}
		disabledIds={$disabledDates.map(dateToId)}
		keyboardReducer={datePickerKeyboardReducer}
		let:isIdSelected
		let:isIdDisabled
		let:isIdCurrent
		let:selectMode
	>
		<div class="grid grid-cols-7">
			{#each $monthDates as date (dateToId(date))}
				<DateGridItem
					{date}
					selected={isIdSelected(dateToId(date))}
					disabled={isIdDisabled(dateToId(date))}
					current={isIdCurrent(dateToId(date))}
					{selectMode}
					neighbours={getHasSelectedNeighbors(date, selectedDates)}
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
