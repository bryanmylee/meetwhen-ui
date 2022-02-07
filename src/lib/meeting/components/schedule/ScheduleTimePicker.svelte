<script lang="ts">
	import type { Interval } from '$lib/core/types/Interval';
	import { getOverlappedSchedules } from '$lib/core/utils/schedules';
	import { TimePicker } from '$lib/input';
	import type { Schedule } from '$lib/models/Schedule';
	import ScheduleInterval from './atoms/ScheduleInterval.svelte';
	import SchedulePickerActiveInterval from './atoms/SchedulePickerActiveInterval.svelte';
	import SchedulePickerBlockCell from './atoms/SchedulePickerBlockCell.svelte';
	import SchedulePickerBlockOverlay from './atoms/SchedulePickerBlockOverlay.svelte';
	import SchedulePickerFocusCell from './atoms/SchedulePickerFocusCell.svelte';
	import SchedulePickerSelectedInterval from './atoms/SchedulePickerSelectedInterval.svelte';

	export let value: Interval[] = [];
	export let error = '';

	export let editing = false;
	$: if (!editing) {
		value = [];
	}

	export let validIntervals: Interval[];
	export let schedules: Schedule[] = [];
	$: scheduleIntervals = getOverlappedSchedules(schedules);
	$: maxUserCountPerInterval = Math.max(
		1,
		...scheduleIntervals.map((i) => i.userIds.size),
	);
</script>

<div class="picker-card">
	<TimePicker
		bind:value
		{error}
		{validIntervals}
		disabled={!editing}
		let:isIdCurrent
		let:isIdDisabled
		let:isIdSelected
		let:selectMode
	>
		<svelte:fragment slot="time-cell" let:dateId let:timeCell>
			<SchedulePickerBlockCell
				{editing}
				{dateId}
				{timeCell}
				{isIdCurrent}
				{isIdDisabled}
				{isIdSelected}
			/>
		</svelte:fragment>
		<svelte:fragment slot="block-overlay" let:block>
			<SchedulePickerBlockOverlay {block} />
		</svelte:fragment>
		<svelte:fragment slot="selected-interval" let:interval>
			<SchedulePickerSelectedInterval {interval} {selectMode} />
		</svelte:fragment>
		<svelte:fragment slot="active-interval" let:interval>
			<SchedulePickerActiveInterval {interval} {selectMode} />
		</svelte:fragment>
		<svelte:fragment slot="focus-cell">
			<SchedulePickerFocusCell {selectMode} />
		</svelte:fragment>
		{#each scheduleIntervals as interval (interval.start.unix())}
			<ScheduleInterval {interval} {maxUserCountPerInterval} {editing} />
		{/each}
	</TimePicker>
</div>

<style lang="postcss">
	.picker-card {
		@apply card p-4;
		--scheduleWidth: 1.5rem;
	}
</style>
