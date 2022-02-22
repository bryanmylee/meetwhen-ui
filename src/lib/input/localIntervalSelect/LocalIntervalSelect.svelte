<script lang="ts" context="module">
	const startOptions = range(24);

	const getInterval = (
		day: Dayjs,
		startHour: number,
		endHour: number,
	): Interval => ({
		start: day.add(startHour, 'hours'),
		end: day.add(endHour, 'hours'),
	});
</script>

<script lang="ts">
	import dayjs from 'dayjs';
	import type { Dayjs } from 'dayjs';
	import { range } from '$lib/core/utils/range';
	import { Select } from '$lib/input';
	import type { Interval } from '$lib/core/types';

	export let top = false;
	export let sm = false;
	export let day = dayjs().startOf('day');

	let startHour = 8;
	$: endOptions = range(startHour + 1, 25);
	let endHour = 17;
	$: if (startHour >= endHour) {
		endHour = startHour + 1;
	}
	let interval = getInterval(day, startHour, endHour);
	export { interval as value };

	let updatedHours = false;
	let updatedInterval = false;
	$: if (updatedHours && updatedInterval) {
		updatedHours = false;
		updatedInterval = false;
	}

	$: interval, updateHours();
	const updateHours = () => {
		updatedInterval = true;
		updatedHours = false;
		if (updatedHours) return;
		startHour = interval.start.hour();
		endHour = interval.end.hour();
		updatedHours = true;
	};

	$: startHour, endHour, updateInterval();
	const updateInterval = () => {
		updatedInterval = false;
		updatedHours = true;
		if (updatedInterval) return;
		interval = {
			start: day.add(startHour, 'hours'),
			end: day.add(endHour, 'hours'),
		};
		updatedInterval = true;
	};

	let className = '';
	export { className as class };
</script>

<div class="{className} interval-select">
	<Select
		bind:value={startHour}
		values={startOptions}
		itemLabel={(t) => day.add(t, 'hour').format('ha')}
		{top}
		{sm}
	/>
	<span>to</span>
	<Select
		bind:value={endHour}
		values={endOptions}
		itemLabel={(t) => day.add(t, 'hour').format('ha')}
		{top}
		{sm}
	/>
</div>

<style lang="postcss">
	.interval-select {
		@apply flex items-center gap-3;
		& > span {
			@apply text-label;
		}
	}
</style>
