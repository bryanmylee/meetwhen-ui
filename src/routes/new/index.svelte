<script lang="ts" context="module">
	const getTimezoneLabel = (tz: typeof timezones[number]) => {
		const tzName = tz.tzCode.replace(/_/g, ' ');
		return `
      <span class="flex items-center justify-between w-full text-xs font-medium text-current">
        <span class="overflow-hidden text-current overflow-ellipsis">${tzName}&nbsp;</span>
        <span class="text-current">${tz.utc}</span>
      </span>
    `;
	};
</script>

<script lang="ts">
	import { flip } from 'svelte/animate';
	import { fade, slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import type { Dayjs } from 'dayjs';
	import timezones from 'timezones-list';
	import {
		Disclosure,
		DisclosureButton,
		DisclosurePanel,
	} from '@rgossiaux/svelte-headlessui';
	import { ListIcon } from 'svelte-feather-icons';
	import { getCurrentTimezone } from '$lib/core/utils/dayjs/getCurrentTimezone';
	import { Textfield, DatePicker, Select, Button } from '$lib/input';
	import type { Interval } from '$lib/core/types/Interval';
	import { dateFromId, dateToId } from '$lib/core/utils/dayjs/dateIds';
	import IntervalPicker from '$lib/input/intervalPicker/IntervalPicker.svelte';
	import { classes } from '$lib/core/utils/classes';
	import { addMeeting } from '$lib/firebase/mutations/addMeeting';
	import { useRepo, useUser } from '$lib/firebase/context';
	import { withError } from '$lib/core/utils/withError';
	import { onDay } from '$lib/core/utils/dayjs/onDay';

	export let selectedDates: Dayjs[] = [];
	$: sortedDates = selectedDates.sort((a, b) =>
		a.isSame(b) ? 0 : a.isBefore(b) ? -1 : 1,
	);

	export let startHourDefault = 8;
	export let endHourDefault = 17;
	let intervalDefault: Interval;

	export let timezoneId = getCurrentTimezone();
	$: timezone =
		timezones.find((tz) => tz.tzCode === timezoneId) ?? timezones[0];

	export let intervalByDate: Record<string, Interval> = {};
	$: selectedDates, updateIntervalByDate();
	const updateIntervalByDate = () => {
		// Add intervalDefault.
		selectedDates.forEach((date) => {
			const dateId = dateToId(date);
			if (intervalByDate[dateId] === undefined) {
				intervalByDate[dateId] = intervalDefault;
			}
		});
		// Remove deselected dates.
		Object.keys(intervalByDate).forEach((key) => {
			if (!selectedDates.some((date) => dateToId(date) === key)) {
				delete intervalByDate[key];
			}
		});
		intervalByDate = intervalByDate;
	};

	const repo = useRepo();
	const user = useUser();

	const name = withError('');
	const intervals = withError<Interval[]>([]);
	$: $intervals.value = Object.entries(intervalByDate).map(
		([dateId, interval]) => {
			const date = dateFromId(dateId);
			return {
				start: onDay(interval.start, date),
				end: onDay(interval.end, date),
			};
		},
	);

	const handleSubmit = async () => {
		if ($user === undefined || $user.ssr) {
			return;
		}
		const meeting = await addMeeting(
			repo,
			{
				name: $name.value,
				intervals: $intervals.value,
			},
			$user,
		);
		console.log(meeting);
	};
</script>

<section>
	<div class="container p-8 mx-auto">
		<form class="flex flex-col gap-4" on:submit|preventDefault={handleSubmit}>
			<h1 class="text-2xl font-bold">Start a new meet</h1>
			<Textfield label="Name of your meet" bind:value={$name.value} />
			<h2 class="font-semibold text">When can you meet?</h2>
			<DatePicker bind:value={selectedDates} />
			<Disclosure let:open>
				<div class="accordian-title" class:open>
					<IntervalPicker
						bind:startHour={startHourDefault}
						bind:endHour={endHourDefault}
						bind:interval={intervalDefault}
						top
						sm
						class="flex-1"
					/>
					<div class="flex items-center flex-1 gap-4">
						<Select
							value={timezone}
							values={timezones}
							itemId={(tz) => tz.tzCode}
							itemLabel={getTimezoneLabel}
							sm
							top
							class="flex-1"
						/>
						<DisclosureButton
							class={classes('accordian-button', open && 'open')}
						>
							<ListIcon class="wh-6" />
						</DisclosureButton>
					</div>
				</div>
				<DisclosurePanel class="accordian-panel">
					<ul
						class="accordian-panel-content"
						transition:slide|local={{ duration: 300, easing: cubicOut }}
					>
						<h3 class="font-semibold">Adjust available times</h3>
						{#each sortedDates as date (dateToId(date))}
							<li
								in:fade|local={{ duration: 300, delay: 150, easing: cubicOut }}
								out:fade|local={{ duration: 300, easing: cubicOut }}
								animate:flip={{ duration: 300, easing: cubicOut }}
								class="interval-picker-item"
							>
								<div class="text-sm flex-0">{date.format('DD MMM')}</div>
								<IntervalPicker
									startHour={8}
									endHour={17}
									bind:interval={intervalByDate[dateToId(date)]}
									top
									sm
									class="flex-1"
								/>
							</li>
						{:else}
							<div class="text-sm">Select a date first.</div>
						{/each}
					</ul>
				</DisclosurePanel>
			</Disclosure>
			<Button type="submit">Create meet</Button>
		</form>
	</div>
</section>

<style lang="postcss">
	.accordian-title {
		@apply flex flex-col w-full p-4 gap-4 md:flex-row md:items-center;
		@apply rounded-xl shadow transition-shadow ring-1 ring-neutral-100 gdark:ring-neutral-600;
		&.open {
			@apply shadow-lg z-10;
		}
	}

	:global(.accordian-button) {
		@apply mx-auto text-xs font-medium focus-text wh-fit;
		&:hover {
			@apply text-primary-400;
		}
		&:active {
			@apply opacity-50;
		}
	}

	:global(.accordian-button.open) {
		@apply text-primary-400;
	}

	:global(.accordian-panel) {
		@apply mx-4 rounded-b-xl;
		@apply shadow ring-inset ring-1 ring-neutral-100 gdark:ring-neutral-600;
	}

	:global(.accordian-panel-content) {
		@apply p-4 flex flex-col gap-4;
	}

	.interval-picker-item {
		@apply flex items-center gap-4;
	}
</style>
