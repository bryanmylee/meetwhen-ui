<script lang="ts">
	import type { Interval } from '$lib/core/types/Interval';
	import { TimePicker } from '$lib/input';
	import SchedulePickerActiveInterval from './atoms/SchedulePickerActiveInterval.svelte';
	import SchedulePickerBlockCell from './atoms/SchedulePickerBlockCell.svelte';
	import SchedulePickerBlockOverlay from './atoms/SchedulePickerBlockOverlay.svelte';
	import SchedulePickerFocusCell from './atoms/SchedulePickerFocusCell.svelte';
	import SchedulePickerSelectedInterval from './atoms/SchedulePickerSelectedInterval.svelte';

	export let editing = false;
	export let intervals: Interval[];
</script>

<div class="picker-card">
	<TimePicker
		validIntervals={intervals}
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
	</TimePicker>
</div>

<style lang="postcss">
	.picker-card {
		@apply card p-4;
		--scheduleWidth: 1.5rem;
	}
</style>
