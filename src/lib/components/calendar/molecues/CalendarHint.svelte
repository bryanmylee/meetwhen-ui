<script lang="ts">
	import { DelayedHint } from '$lib/components/atoms';
	import GridInterval from '../atoms/GridInterval.svelte';
	import type { CalendarState } from '$lib/components/calendar/state/core';
	import type { Writable } from 'svelte/store';
	import { getContext } from 'svelte';
	import { touchEnabled } from '$lib/app-state';

	const state = getContext<CalendarState>('state');
	const { allDayHours, hourStepSize } = state;
	$: selectedHour = $allDayHours[1];
	// `selectedHour` can be undefined.
	$: interval =
		selectedHour === undefined
			? undefined
			: {
					beg: selectedHour,
					end: selectedHour.add($hourStepSize, 'hour'),
			  };

	const disabled = getContext<Writable<boolean>>('disabled');
	export let hasTouched = false;
</script>

{#if interval !== undefined}
	<GridInterval let:element {interval} class="w-full h-full pointer-events-none">
		<DelayedHint show={!$disabled && !hasTouched} delay={1000} referenceElement={element}>
			{$touchEnabled ? 'Long press and drag to pick your time' : 'Click and drag to pick your time'}
		</DelayedHint>
	</GridInterval>
{/if}
