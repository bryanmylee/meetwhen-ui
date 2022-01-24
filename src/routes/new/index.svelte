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
	import { slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import type { Dayjs } from 'dayjs';
	import timezones from 'timezones-list';
	import { ListIcon } from 'svelte-feather-icons';
	import { goto } from '$app/navigation';
	import { getCurrentTimezone } from '$lib/core/utils/dayjs/getCurrentTimezone';
	import {
		Button,
		DatePicker,
		LocalIntervalSelect,
		Select,
		Textfield,
	} from '$lib/input';
	import type { Interval } from '$lib/core/types/Interval';
	import { classes } from '$lib/core/utils/classes';
	import { addMeeting } from '$lib/firebase/mutations/addMeeting';
	import { useRepo, useUser } from '$lib/firebase/context';
	import { withError } from '$lib/core/utils/withError';
	import LocalIntervalsSelect from '$lib/new/components/LocalIntervalsSelect.svelte';
	import { onDay } from '$lib/core/utils/dayjs/onDay';

	export let selectedDates: Dayjs[] = [];
	export let overallInterval: Interval;

	export let timezoneId = getCurrentTimezone();
	$: timezone =
		timezones.find((tz) => tz.tzCode === timezoneId) ?? timezones[0];

	const repo = useRepo();
	const user = useUser();

	const name = withError('');
	const intervals = withError<Interval[]>([]);
	$: $intervals.value = useAdjustedIntervals
		? adjustedIntervals
		: overallIntervals;
	$: console.log($intervals.value);

	let overallIntervals: Interval[] = [];
	$: overallIntervals = selectedDates.map((date) => ({
		start: onDay(overallInterval.start, date),
		end: onDay(overallInterval.end, date),
	}));

	let adjustedIntervals: Interval[] = [];
	let useAdjustedIntervals = false;

	const toggleAdjustedIntervals = () => {
		if (useAdjustedIntervals && adjustedIntervals.length !== 0) {
			// Show confirmation dialog.
			console.log('are you sure?');
			return;
		}
		useAdjustedIntervals = !useAdjustedIntervals;
	};

	const handleSubmit = async () => {
		if ($user?.ssr) {
			return;
		}
		if ($intervals.value.length === 0) {
			$intervals.error = 'Select a date';
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
		goto(`/${meeting.slug}`);
	};
</script>

<section>
	<div class="container p-8 mx-auto">
		<form class="flex flex-col gap-4" on:submit|preventDefault={handleSubmit}>
			<h1 class="text-2xl font-bold">Start a new meet</h1>
			<Textfield
				label="Name of your meet"
				bind:value={$name.value}
				error={$name.error}
				required
			/>
			<h2 class="font-semibold text">When can you meet?</h2>
			<DatePicker bind:value={selectedDates} error={$intervals.error} />
			<div>
				<div class="adjust-title" class:open={useAdjustedIntervals}>
					<LocalIntervalSelect
						bind:value={overallInterval}
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
						<Button
							class={classes('adjust-button', useAdjustedIntervals && 'open')}
							variant="text-only"
							icon
							on:click={toggleAdjustedIntervals}
						>
							<ListIcon class="wh-6" />
						</Button>
					</div>
				</div>
				{#if useAdjustedIntervals}
					<ul
						class="adjust-panel"
						transition:slide|local={{ duration: 300, easing: cubicOut }}
					>
						<h3 class="font-semibold">Adjust available times</h3>
						<LocalIntervalsSelect
							bind:intervals={adjustedIntervals}
							{selectedDates}
							defaultInterval={overallInterval}
						/>
					</ul>
				{/if}
			</div>
			<Button type="submit">Create meet</Button>
		</form>
	</div>
</section>

<style lang="postcss">
	.adjust-title {
		@apply flex flex-col w-full p-4 gap-4 md:flex-row md:items-center;
		@apply rounded-xl shadow transition-shadow ring-1 ring-neutral-100 gdark:ring-neutral-600;
		&.open {
			@apply shadow-lg z-10;
		}
	}

	:global(.adjust-button.open) {
		@apply !text-primary-400;
	}

	.adjust-panel {
		@apply mx-4 rounded-b-xl;
		@apply p-4 flex flex-col gap-4;
		@apply shadow ring-inset ring-1 ring-neutral-100 gdark:ring-neutral-600;
	}
</style>
