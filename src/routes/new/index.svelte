<script lang="ts" context="module">
	const getTimezoneLabel = (tz: Timezone) => {
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
	import { tick } from 'svelte';
	import { fade, fly, slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import type { Dayjs } from 'dayjs';
	import { ListIcon } from 'svelte-feather-icons';
	import {
		Dialog,
		DialogOverlay,
		DialogTitle,
		DialogDescription,
	} from '@rgossiaux/svelte-headlessui';
	import { goto } from '$app/navigation';
	import { getCurrentTimezone } from '$lib/core/utils/dayjs/getCurrentTimezone';
	import { timezones } from '$lib/core/utils/dayjs/timezones';
	import type { Timezone } from '$lib/core/utils/dayjs/timezones';
	import {
		Button,
		DatePicker,
		LocalIntervalSelect,
		Select,
		Textfield,
	} from '$lib/input';
	import type { Interval } from '$lib/core/types/Interval';
	import type { Maybe } from '$lib/core/types/Maybe';
	import { classes } from '$lib/core/utils/classes';
	import { addMeeting } from '$lib/firebase/mutations/addMeeting';
	import { useRepo, useUser } from '$lib/firebase/context';
	import { withError } from '$lib/core/utils/withError';
	import { primaryVars } from '$lib/core/state';
	import { arrayEquals } from '$lib/core/utils/arrayEquals';
	import { localIntervalOnDay } from '$lib/core/utils/intervals';
	import { arrayNotEmpty } from '$lib/input/utils/validation/arrayNotEmpty';
	import { LocalIntervalsSelect, LinksTextfields } from '$lib/new/components';

	export let selectedDates: Dayjs[] = [];
	export let overallInterval: Interval;

	export let timezoneId = getCurrentTimezone();
	$: timezone =
		timezones.find((tz) => tz.tzCode === timezoneId) ?? timezones[0];

	const repo = useRepo();
	const user = useUser();

	const name = withError('');

	const intervals = withError<Interval[]>([], {
		validators: [arrayNotEmpty({ errorMessage: 'Select one or more dates' })],
	});
	$: $intervals.value = useAdjustedIntervals
		? adjustedIntervals
		: overallIntervals;

	let overallIntervals: Interval[] = [];
	$: overallIntervals = selectedDates
		.map((date) => localIntervalOnDay(overallInterval, date))
		.sort((a, b) => a.start.diff(b.start));

	let adjustedIntervals: Interval[] = [];
	let useAdjustedIntervals = false;
	let showCancelAdjustConfirmation = false;

	$: isAdjusted = !arrayEquals(
		adjustedIntervals,
		overallIntervals,
		(a, b) => a.start.isSame(b.start) && a.end.isSame(b.end),
	);

	const toggleAdjustedIntervals = () => {
		if (useAdjustedIntervals && adjustedIntervals.length !== 0 && isAdjusted) {
			showCancelAdjustConfirmation = true;
			return;
		}
		useAdjustedIntervals = !useAdjustedIntervals;
	};

	let linksRef: Maybe<LinksTextfields>;
	let links: string[] = [];
	let linkErrors: string[] = [];

	$: errors = [...$intervals.errors, ...linkErrors];

	const handleSubmit = async () => {
		if ($user?.ssr) {
			return;
		}
		intervals.validate();
		linksRef?.validate();
		// Wait on `errors` reactive update.
		await tick();
		if (errors.length !== 0) {
			console.error(errors);
			return;
		}
		const meeting = await addMeeting(
			repo,
			{
				name: $name.value,
				intervals: $intervals.value,
				links,
			},
			$user,
		);
		goto(`/${meeting.slug}`);
	};
</script>

<section>
	<div class="container p-8 mx-auto">
		<form class="flex flex-col gap-4" on:submit|preventDefault={handleSubmit}>
			<h1 class="text-title-1">Start a new meet</h1>
			<Textfield
				label="Name of your meet"
				bind:value={$name.value}
				error={$name.error}
				required
			/>
			<div class="when">
				<div class="when-content" class:open={useAdjustedIntervals}>
					<h2 class="text-headline">When can you meet?</h2>
					<DatePicker
						bind:value={selectedDates}
						error={$intervals.error}
						use={[intervals.touch]}
					/>
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
					<div
						class="adjust-panel"
						transition:slide|local={{ duration: 300, easing: cubicOut }}
					>
						<h3 class="text-headline">Adjust available times</h3>
						<LocalIntervalsSelect
							bind:intervals={adjustedIntervals}
							{selectedDates}
							defaultInterval={overallInterval}
						/>
					</div>
				{/if}
			</div>
			<div class="add-links">
				<h2 class="text-headline">Add a location or link</h2>
				<LinksTextfields bind:values={links} bind:errors={linkErrors} />
			</div>
			<Button type="submit">Create meet</Button>
		</form>
	</div>
</section>
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
							useAdjustedIntervals = false;
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
	.when {
		@apply w-full p-4 rounded-xl shadow;
		@apply ring-1 ring-neutral-100 gdark:ring-neutral-600;
	}

	.when-content {
		@apply flex flex-col w-full gap-4 md:flex-row md:items-center;
		&.open {
			@apply pb-4;
			@apply border-b border-neutral-200 gdark:border-neutral-600;
		}
	}

	:global(.adjust-button.open) {
		@apply text-primary-400;
	}

	.adjust-panel {
		@apply pt-4 flex flex-col gap-4;
	}

	.adjust-confirm-card {
		@apply relative z-10 p-6 shadow-lg rounded-xl bg-shade-0;
		@apply flex flex-col gap-4;
		@apply w-96;
	}

	.add-links {
		@apply flex flex-col gap-4;
		@apply p-4 rounded-xl shadow transition-shadow;
		@apply ring-1 ring-neutral-100 gdark:ring-neutral-600;
	}
</style>
