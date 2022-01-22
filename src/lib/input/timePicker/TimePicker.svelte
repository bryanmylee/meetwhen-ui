<script lang="ts">
	import BaseTimePicker from './BaseTimePicker.svelte';
	import TimePickerActiveInterval from './atoms/TimePickerActiveInterval.svelte';
	import TimePickerSelectedInterval from './atoms/TimePickerSelectedInterval.svelte';
	import TimePickerBlockOverlay from './atoms/TimePickerBlockOverlay.svelte';
	import TimePickerColumn from './atoms/TimePickerColumn.svelte';
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
	{value}
	let:isIdSelected
	let:isIdCurrent
	let:isIdDisabled
	let:selectMode
>
	<svelte:fragment slot="column" let:dateId let:timeCell>
		<TimePickerColumn
			{dateId}
			{timeCell}
			{isIdSelected}
			{isIdCurrent}
			{isIdDisabled}
			{selectMode}
		/>
	</svelte:fragment>
	<svelte:fragment slot="block-overlay" let:block>
		<TimePickerBlockOverlay {block} />
	</svelte:fragment>
	<svelte:fragment slot="selected-interval" let:interval>
		<TimePickerSelectedInterval {interval} {selectMode} />
	</svelte:fragment>
	<svelte:fragment slot="active-interval" let:interval>
		<TimePickerActiveInterval {interval} {selectMode} />
	</svelte:fragment>
</BaseTimePicker>
