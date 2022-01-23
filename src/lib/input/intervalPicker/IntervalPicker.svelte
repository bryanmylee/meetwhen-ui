<script lang="ts" context="module">
	const startOptions = range(24);
</script>

<script lang="ts">
	import dayjs from 'dayjs';
	import { range } from '$lib/core/utils/range';
	import { Select } from '$lib/input';
	import type { Interval } from '$lib/core/types/Interval';
	import type { Maybe } from '$lib/core/types/Maybe';

	export let top = false;
	export let sm = false;

	export let startHour: number;
	$: endOptions = range(startHour + 1, 25);
	export let endHour: number;
	$: if (startHour >= endHour) {
		endHour = startHour + 1;
	}

	export let day = dayjs().startOf('day');
	export let interval: Maybe<Interval> = undefined;
	$: interval = {
		start: day.add(startHour, 'hours'),
		end: day.add(endHour, 'hours'),
	};

	let className = '';
	export { className as class };
</script>

<div class="{className} interval-picker">
	<Select
		bind:value={startHour}
		values={startOptions}
		itemLabel={(t) => dayjs().startOf('day').add(t, 'hour').format('ha')}
		{top}
		{sm}
	/>
	<span>to</span>
	<Select
		bind:value={endHour}
		values={endOptions}
		itemLabel={(t) => dayjs().startOf('day').add(t, 'hour').format('ha')}
		{top}
		{sm}
	/>
</div>

<style lang="postcss">
	.interval-picker {
		@apply flex items-center gap-3;
		& > span {
			@apply text-xs font-medium;
		}
	}
</style>
