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
	import {
		Disclosure,
		DisclosureButton,
		DisclosurePanel,
	} from '@rgossiaux/svelte-headlessui';
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

	export let selectedDates: Dayjs[] = [];
	export let defaultInterval: Interval;

	export let timezoneId = getCurrentTimezone();
	$: timezone =
		timezones.find((tz) => tz.tzCode === timezoneId) ?? timezones[0];

	const repo = useRepo();
	const user = useUser();

	const name = withError('');
	const intervals = withError<Interval[]>([]);
	$: console.log($intervals.value);

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
			<Disclosure let:open>
				<div class="accordian-title" class:open>
					<LocalIntervalSelect
						bind:value={defaultInterval}
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
						<LocalIntervalsSelect
							bind:intervals={$intervals.value}
							{selectedDates}
							{defaultInterval}
						/>
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
</style>
