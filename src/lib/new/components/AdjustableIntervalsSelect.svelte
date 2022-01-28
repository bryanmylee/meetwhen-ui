<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import type { Dayjs } from 'dayjs';
	import {
		Dialog,
		DialogDescription,
		DialogOverlay,
		DialogTitle,
		Tab,
		TabGroup,
		TabList,
		TabPanel,
		TabPanels,
	} from '@rgossiaux/svelte-headlessui';
	import { dateFromId, dateToId } from '$lib/core/utils/dayjs/dateIds';
	import type { Interval } from '$lib/core/types/Interval';
	import { Button, LocalIntervalSelect } from '$lib/input';
	import { localIntervalOnDay } from '$lib/core/utils/intervals';
	import { cssVars } from '$lib/core/utils/cssVars';
	import { arrayEquals } from '$lib/core/utils/arrayEquals';
	import { primaryVars } from '$lib/core/state';
	import dayjs from 'dayjs';

	export let selectedDates: Dayjs[] = [];
	$: sortedDateIds = selectedDates.map(dateToId).sort();

	export let overallInterval: Interval = {
		start: dayjs().startOf('day').hour(8),
		end: dayjs().startOf('day').hour(17),
	};

	$: overallIntervals = selectedDates.map((date) =>
		localIntervalOnDay(overallInterval, date),
	);

	let intervalsByDate: Record<string, Record<string, Interval>> = {};
	$: sortedDateIds, updateIntervalsByDate();
	const updateIntervalsByDate = () => {
		// Add defaultInterval.
		sortedDateIds.forEach((dateId) => {
			if (intervalsByDate[dateId] === undefined) {
				intervalsByDate[dateId] = { '0': overallInterval };
			}
		});
		// Remove deselected dates.
		Object.keys(intervalsByDate).forEach((key) => {
			if (!sortedDateIds.includes(key)) {
				delete intervalsByDate[key];
			}
		});
		intervalsByDate = intervalsByDate;
	};

	$: adjustedIntervals = Object.entries(intervalsByDate).flatMap(
		([dateId, dateIntervals]) => {
			const date = dateFromId(dateId);
			return Object.values(dateIntervals).map((dateInterval) =>
				localIntervalOnDay(dateInterval, date),
			);
		},
	);

	$: isAdjusted = !arrayEquals(
		adjustedIntervals,
		overallIntervals,
		(a, b) => a.start.isSame(b.start) && a.end.isSame(b.end),
	);

	export let tabIndex = 0;
	$: useAdjusted = tabIndex === 1;
	export let intervals: Interval[] = [];
	$: intervals = useAdjusted ? adjustedIntervals : overallIntervals;

	let showCancelAdjustConfirmation = false;

	$: numRows = sortedDateIds.flatMap((dateId) =>
		Object.keys(intervalsByDate[dateId]),
	).length;
</script>

<TabGroup on:change={({ detail }) => (tabIndex = detail)}>
	<TabList class="flex items-baseline">
		<span class="text-label pr-2">What time</span>
		<Tab let:selected class="group focus:outline-none">
			<span class="tab-item group-focus:ring ring-primary-400" class:selected>
				every day
			</span>
		</Tab>
		<Tab let:selected class="group focus:outline-none">
			<span class="tab-item group-focus:ring ring-primary-400" class:selected>
				per day
			</span>
		</Tab>
		<span class="text-label pl-2">?</span>
	</TabList>
	<TabPanels>
		<TabPanel
			class="mt-4 rounded-xl focus:ring ring-primary-400 focus:outline-none"
		>
			<LocalIntervalSelect bind:value={overallInterval} top sm />
		</TabPanel>
		<TabPanel
			class="mt-4 rounded-xl focus:ring ring-primary-400 focus:outline-none"
		>
			<ul class="adjusted-intervals-list" style={cssVars({ numRows })}>
				{#each sortedDateIds as dateId, index (dateId)}
					<li
						in:fade|local={{ duration: 300, delay: 150, easing: cubicOut }}
						out:fade|local={{ duration: 300, easing: cubicOut }}
						class="adjusted-select-item"
						style={cssVars({ index })}
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
					<li class="text-label p-2">Select a date first.</li>
				{/each}
			</ul>
		</TabPanel>
	</TabPanels>
</TabGroup>
<Dialog
	open={showCancelAdjustConfirmation}
	on:close={() => (showCancelAdjustConfirmation = false)}
>
	<div
		class="fixed inset-0 z-10 flex items-center justify-center"
		style={$primaryVars}
	>
		<div transition:fade={{ duration: 300, easing: cubicOut }}>
			<DialogOverlay class="fixed inset-0 bg-neutral-600/50" />
			<div
				class="adjust-confirm-card"
				in:fly={{ duration: 500, y: 50, easing: cubicOut }}
			>
				<DialogTitle as="h1" class="text-title-2">
					Discard adjusted times?
				</DialogTitle>
				<DialogDescription class="text-sm">
					You will lose your current adjustments.
				</DialogDescription>
				<div class="flex gap-4">
					<Button
						color="gray"
						size="sm"
						on:click={() => (showCancelAdjustConfirmation = false)}
					>
						Cancel
					</Button>
					<Button
						size="sm"
						on:click={() => {
							showCancelAdjustConfirmation = false;
							useAdjusted = false;
						}}
					>
						Continue
					</Button>
				</div>
			</div>
		</div>
	</div>
</Dialog>

<style lang="postcss">
	.tab-item {
		@apply text-label p-2 rounded-lg;
		&:hover {
			@apply bg-shade-50 shadow;
		}
		&.selected {
			@apply bg-shade-100 text-primary-400;
		}
		&:not(.selected) {
			@apply text-neutral-300 gdark:text-neutral-500;
		}
	}
	.adjusted-intervals-list {
		@apply relative flex flex-col gap-4;
		/* Default text, or 2.5rem for each row and 1rem for padding in between. */
		height: max(2.5rem, calc(2.5rem + (var(--numRows) - 1) * 3.5rem));
		transition: height 300ms var(--cubicOut);
	}

	.adjusted-select-item {
		@apply flex items-start gap-4;
		@apply absolute left-0 right-0;
		/* 2.5rem + 1rem for each row and padding above */
		top: calc(var(--index) * 3.5rem);
		transition: top 300ms var(--cubicOut);
	}

	.adjust-confirm-card {
		@apply relative z-10 p-6 shadow-lg rounded-xl bg-shade-0;
		@apply flex flex-col gap-4;
		@apply w-96;
	}
</style>
