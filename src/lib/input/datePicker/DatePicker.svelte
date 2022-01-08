<script lang="ts">
	import dayjs from 'dayjs';
	import type { Dayjs } from 'dayjs';
	import type { Maybe } from '$lib/core/types/Maybe';
	import { dateFromId, dateToId } from './utils/dateIds';
	import { getDatePickerState } from './utils/getDatePickerState';
	import { getHasSelectedNeighbors } from './utils/getHasSelectedNeighbors';
	import { SelectionProvider, SelectionProviderEvent } from '..';
	import MonthPicker from './atoms/MonthPicker.svelte';
	import DateGridItem from './atoms/DateGridItem.svelte';

	const { month, weekDays, monthDates, disabledDates } = getDatePickerState();

	let selectedDates: Dayjs[] = [];
	export { selectedDates as value };
	/**
	 * SelectionProvider binding.
	 */
	let selectedIds: string[] = selectedDates.map(dateToId);
	$: selectedDates = selectedIds.map(dateFromId);

	export let focusedDate = dayjs();

	let selector: Maybe<SelectionProvider>;

	const handleToggle = ({
		detail,
	}: CustomEvent<SelectionProviderEvent['toggle']>) => {
		focusedDate = dateFromId(detail.lastId);
	};
</script>

<div class="date-picker">
	<MonthPicker bind:month={$month} />
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
		disabledIds={$disabledDates.map(dateToId)}
		on:toggle={handleToggle}
		let:isIdSelected
		let:isIdDisabled
		let:selectMode
	>
		<div class="grid grid-cols-7">
			{#each $monthDates as date (dateToId(date))}
				<DateGridItem
					{date}
					selected={isIdSelected(dateToId(date))}
					disabled={isIdDisabled(dateToId(date))}
					focused={date.isSame(focusedDate, 'day')}
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
