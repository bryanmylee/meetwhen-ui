<script lang="ts">
	import { fade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { cubicOut } from 'svelte/easing';
	import type { Dayjs } from 'dayjs';
	import { dateFromId, dateToId } from '$lib/core/utils/dayjs/dateIds';
	import type { Interval } from '$lib/core/types/Interval';
	import { onDay } from '$lib/core/utils/dayjs/onDay';
	import { LocalIntervalPicker } from '$lib/input';

	export let selectedDates: Dayjs[] = [];
	$: sortedDateIds = selectedDates.map(dateToId).sort();

	export let defaultInterval: Interval;

	let intervalsByDate: Record<string, Record<string, Interval>> = {};
	$: sortedDateIds, updateIntervalByDate();
	const updateIntervalByDate = () => {
		// Add defaultInterval.
		sortedDateIds.forEach((dateId) => {
			if (intervalsByDate[dateId] === undefined) {
				intervalsByDate[dateId] = { '0': defaultInterval };
			}
		});
		// Remove deselected dates.
		Object.keys(intervalsByDate).forEach((key) => {
			if (!selectedDates.some((date) => dateToId(date) === key)) {
				delete intervalsByDate[key];
			}
		});
		intervalsByDate = intervalsByDate;
	};

	export let intervals: Interval[] = [];
	$: intervals = Object.entries(intervalsByDate).flatMap(
		([dateId, intervals]) => {
			const date = dateFromId(dateId);
			return Object.values(intervals).map((interval) => ({
				start: onDay(interval.start, date),
				end: onDay(interval.end, date),
			}));
		},
	);
</script>

{#each sortedDateIds as dateId (dateId)}
	<li
		in:fade|local={{ duration: 300, delay: 150, easing: cubicOut }}
		out:fade|local={{ duration: 300, easing: cubicOut }}
		animate:flip={{ duration: 300, easing: cubicOut }}
		class="interval-picker-item"
	>
		<div class="text-sm flex-0 py-2.5">
			{dateFromId(dateId).format('DD MMM')}
		</div>
		<ul class="flex-1 flex flex-col gap-4">
			{#each Object.keys(intervalsByDate[dateId]) as keyInDate}
				<li class="flex-1">
					<LocalIntervalPicker
						bind:value={intervalsByDate[dateId][keyInDate]}
						top
						sm
					/>
				</li>
			{/each}
		</ul>
	</li>
{:else}
	<div class="text-sm">Select a date first.</div>
{/each}

<style lang="postcss">
	.interval-picker-item {
		@apply flex items-start gap-4;
	}
</style>
