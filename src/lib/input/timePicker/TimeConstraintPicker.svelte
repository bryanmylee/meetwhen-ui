<script lang="ts">
	import BaseTimePicker from './BaseTimePicker.svelte';
	import TimeConstraintPickerActiveInterval from './atoms/TimeConstraintPickerActiveInterval.svelte';
	import TimeConstraintPickerBlockCell from './atoms/TimeConstraintPickerBlockCell.svelte';
	import TimeConstraintPickerBlockOverlay from './atoms/TimeConstraintPickerBlockOverlay.svelte';
	import TimeConstraintPickerSelectedInterval from './atoms/TimeConstraintPickerSelectedInterval.svelte';
	import type { Maybe } from '$lib/core/types/Maybe';
	import type { Interval } from '$lib/core/types/Interval';

	export let id: Maybe<string> = undefined;
	export let error = '';
	export let validIntervals: Interval[] = [];
	export let resolution = 30;
	export let value: Interval[] = [];
</script>

<BaseTimePicker
	{id}
	{error}
	{validIntervals}
	{resolution}
	bind:value
	let:isIdSelected
	let:isIdCurrent
	let:isIdDisabled
	let:selectMode
>
	<svelte:fragment slot="time-cell" let:dateId let:timeCell>
		<TimeConstraintPickerBlockCell
			{dateId}
			{timeCell}
			{isIdSelected}
			{isIdCurrent}
			{isIdDisabled}
			{selectMode}
		/>
	</svelte:fragment>
	<svelte:fragment slot="block-overlay" let:block>
		<TimeConstraintPickerBlockOverlay {block} />
	</svelte:fragment>
	<svelte:fragment slot="selected-interval" let:interval>
		<TimeConstraintPickerSelectedInterval {interval} {selectMode} />
	</svelte:fragment>
	<svelte:fragment slot="active-interval" let:interval>
		<TimeConstraintPickerActiveInterval {interval} {selectMode} />
	</svelte:fragment>
</BaseTimePicker>
