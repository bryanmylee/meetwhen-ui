<script lang="ts">
	import DateItem from '../atoms/DateItem.svelte';
	import MonthPicker from '../molecues/MonthPicker.svelte';
	import SelectableProvider from '$lib/components/utils/selectable/SelectableProvider.svelte';
	import dayjs from 'dayjs';
	import type { Dayjs } from 'dayjs';
	import { fromId, toId } from '../utils';
	import { getDatePickerState } from '../state';
	import { hasNeighbours } from '../has-neighbours';
	import { keyActions } from '../keyboard';

	const { month, weekDays, monthDates, disabledDates } = getDatePickerState();

	export let selectedDates: Dayjs[] = [];
	let selectedIds: string[] = selectedDates.map(toId);
	$: selectedDates = selectedIds.map(fromId);

	export let error = '';

	// -1 as the blurred state.
	let focusedIndex = -1;
	$: focusedDateId = toId($monthDates[focusedIndex]);

	const focus = () => {
		if (focusedIndex !== -1) {
			return;
		}
		focusedIndex = $month.isSame(dayjs(), 'month') ? dayjs().date() - 1 : 0;
	};

	const blur = () => {
		focusedIndex = -1;
	};

	const keydown = (event: KeyboardEvent) => {
		const { key } = event;
		if (key === ' ' || key === 'Enter') {
			selector?.toggle(focusedDateId);
			return;
		}
		if (Object.keys(keyActions).includes(key)) {
			const result = keyActions[key]([focusedIndex, $month]);
			focusedIndex = result[0];
			$month = result[1];
			event.preventDefault();
		}
	};

	let selector: SelectableProvider | undefined;

	const toggle = ({ detail }: CustomEvent) => {
		focusedIndex = $monthDates.findIndex((date) => toId(date) === detail.id);
	};
</script>

<div class="relative p-4 shade rounded-xl focusable" class:error={error !== ''}>
	<MonthPicker bind:month={$month} />

	<div class="grid grid-cols-7">
		{#each $weekDays as day}
			<div class="p-2 text-center">
				{day.format('ddd')}
			</div>
		{/each}
	</div>

	<SelectableProvider
		bind:this={selector}
		on:toggle={toggle}
		bind:selectedIds
		disabledIds={$disabledDates.map(toId)}
		let:selecting
		let:isDisabled
	>
		<div
			tabindex="0"
			on:focus={focus}
			on:blur={blur}
			on:keydown={keydown}
			class="relative z-0 grid grid-cols-7 focus:outline-none"
		>
			{#each $monthDates as date, index (toId(date))}
				<DateItem
					{date}
					selected={selectedDates.map(toId).includes(toId(date))}
					{selecting}
					neighbours={hasNeighbours(date, selectedDates)}
					disabled={isDisabled(toId(date))}
					focused={focusedIndex === index}
				/>
			{/each}
		</div>
	</SelectableProvider>

	{#if error !== ''}
		<span class="absolute text-xs italic text-red-400 transform -translate-x-1/2 bottom-2 left-1/2">
			{error}
		</span>
	{/if}
</div>
