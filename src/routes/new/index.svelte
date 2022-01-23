<script lang="ts" context="module">
	const getTimezoneLabel = (tz: typeof timezones[number]) => {
		const tzName = tz.tzCode.replace(/_/g, ' ');
		return `
      <span class="w-full flex justify-between items-center text-current text-xs font-medium">
        <span class="text-current overflow-hidden overflow-ellipsis">${tzName}&nbsp;</span>
        <span class="text-current">${tz.utc}</span>
      </span>
    `;
	};
</script>

<script lang="ts">
	import type { Dayjs } from 'dayjs';
	import timezones from 'timezones-list';
	import { getCurrentTimezone } from '$lib/core/utils/dayjs/getCurrentTimezone';
	import { Textfield, DatePicker } from '$lib/input';
	import type { Interval } from '$lib/core/types/Interval';
	import { dateToId } from '$lib/core/utils/dayjs/dateIds';
	import IntervalPicker from '$lib/input/intervalPicker/IntervalPicker.svelte';

	export let selectedDates: Dayjs[] = [];
	$: sortedDates = selectedDates.sort((a, b) =>
		a.isSame(b) ? 0 : a.isBefore(b) ? -1 : 1,
	);
	export let timezoneId = getCurrentTimezone();
	$: timezone =
		timezones.find((tz) => tz.tzCode === timezoneId) ?? timezones[0];

	export let intervals: Record<string, Interval> = {};
</script>

<section>
	<div class="container mx-auto p-8">
		<form class="flex flex-col gap-4">
			<h1 class="text-xl font-bold">Start a new meet</h1>
			<Textfield label="Name of your meet" />
			<h2 class="text-lg font-semibold">When can you meet?</h2>
			<DatePicker bind:value={selectedDates} />
			<ul class="flex flex-col gap-4">
				{#each sortedDates as date (dateToId(date))}
					<li class="flex items-center gap-4">
						<div class="flex-0">{date.format('DD MMM')}</div>
						<IntervalPicker
							startHour={8}
							endHour={17}
							bind:interval={intervals[dateToId(date)]}
							top
							sm
							class="flex-1"
						/>
					</li>
				{/each}
			</ul>
		</form>
	</div>
</section>

<style lang="postcss">
	.time-select-grid {
		@apply grid gap-4 items-center;
		grid-template-columns: auto 1fr;
		@apply md:flex;
		& > label {
			@apply text-right font-medium;
		}
	}
</style>
