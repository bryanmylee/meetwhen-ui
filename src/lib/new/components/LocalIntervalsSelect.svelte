<script lang="ts">
	import { fade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { cubicOut } from 'svelte/easing';
	import type { Dayjs } from 'dayjs';
	import { dateFromId, dateToId } from '$lib/core/utils/dayjs/dateIds';
	import type { Interval } from '$lib/core/types/Interval';
	import { LocalIntervalSelect } from '$lib/input';
	import { localIntervalOnDay } from '$lib/core/utils/intervals';
	import { cssVars } from '$lib/core/utils/cssVars';

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

	$: numRows = sortedDateIds.flatMap((dateId) =>
		Object.keys(intervalsByDate[dateId]),
	).length;

	export let intervals: Interval[] = [];
	$: intervals = Object.entries(intervalsByDate).flatMap(
		([dateId, intervals]) => {
			const date = dateFromId(dateId);
			return Object.values(intervals).map((interval) =>
				localIntervalOnDay(interval, date),
			);
		},
	);
</script>

<ul class="interval-picker-list" style={cssVars({ numRows })}>
	{#each sortedDateIds as dateId (dateId)}
		<li
			in:fade|local={{ duration: 300, delay: 150, easing: cubicOut }}
			out:fade|local={{ duration: 300, easing: cubicOut }}
			animate:flip={{ duration: 300, easing: cubicOut }}
			class="interval-picker-item"
		>
			<div class="text-label flex-0 py-2.5">
				{dateFromId(dateId).format('DD MMM')}
			</div>
			<ul class="flex-1 flex flex-col gap-4">
				{#each Object.keys(intervalsByDate[dateId]) as keyInDate}
					<li class="flex-1">
						<LocalIntervalSelect
							bind:value={intervalsByDate[dateId][keyInDate]}
							top
							sm
						/>
					</li>
				{/each}
			</ul>
		</li>
	{:else}
		<div class="text-label">Select a date first.</div>
	{/each}
</ul>

<style lang="postcss">
	.interval-picker-list {
		@apply flex flex-col gap-4;
		/* Default text, or 2.5rem for each row and 1rem for padding in between. */
		height: max(1.5rem, calc(2.5rem + (var(--numRows) - 1) * 3.5rem));
		transition: height 200ms ease-in-out;
	}

	.interval-picker-item {
		@apply flex items-start gap-4;
	}
</style>
