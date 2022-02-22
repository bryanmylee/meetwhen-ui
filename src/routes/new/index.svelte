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
	import { writable } from 'svelte/store';
	import type { Dayjs } from 'dayjs';
	import { goto } from '$app/navigation';
	import { getCurrentTimezone } from '$lib/core/utils/dayjs/getCurrentTimezone';
	import { timezones } from '$lib/core/utils/dayjs/timezones';
	import type { Timezone } from '$lib/core/utils/dayjs/timezones';
	import { withError } from '$lib/core/utils/withError';
	import { LoadingButton, DatePicker, Select } from '$lib/input';
	import { arrayNotEmpty } from '$lib/input/utils/validation/arrayNotEmpty';
	import type { Interval } from '$lib/core/types/Interval';
	import type { Maybe } from '$lib/core/types/Maybe';
	import { addMeeting } from '$lib/firebase/mutations/addMeeting';
	import { useRepo, useUser } from '$lib/firebase/context';
	import Head from '$lib/core/components/Head.svelte';
	import {
		AdjustableIntervalsSelect,
		LinksTextfields,
		Name,
	} from '$lib/new/components';
	import { setLoading, withLoading } from '$lib/loading';

	export let selectedDates: Dayjs[] = [];

	export let timezoneId = getCurrentTimezone();
	$: timezone =
		timezones.find((tz) => tz.tzCode === timezoneId) ?? timezones[0];

	const repo = useRepo();
	const user = useUser();

	const name = withError('');
	const description = withError('');

	const intervals = withError<Interval[]>([], {
		validators: [arrayNotEmpty({ errorMessage: 'Select one or more dates' })],
	});

	let linksRef: Maybe<LinksTextfields>;
	let links: string[] = [];
	let linkErrors: string[] = [];

	$: errors = [
		...$name.errors,
		...$description.errors,
		...$intervals.errors,
		...linkErrors,
	];

	const isLoading = writable(false);
	setLoading(isLoading);

	const _handleSubmit = async () => {
		const currentUser = $user == null || $user?.ssr ? undefined : $user;
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
				description: $description.value !== '' ? $description.value : undefined,
				intervals: $intervals.value,
				links,
			},
			currentUser,
		);
		await goto(`/${meeting.slug}`);
	};
	const handleSubmit = withLoading(isLoading, _handleSubmit);
</script>

<Head subtitle="new" />

<section>
	<div class="w-full max-w-xl p-4 mx-auto">
		<form class="flex flex-col gap-4" on:submit|preventDefault={handleSubmit}>
			<h1 class="text-title-1">Start a new meet</h1>
			<Name {name} {description} />
			<div class="when">
				<h2 class="text-headline required-dot">When can you meet?</h2>
				<DatePicker
					bind:value={selectedDates}
					error={$intervals.error}
					use={[intervals.touch]}
				/>
				<AdjustableIntervalsSelect
					{selectedDates}
					bind:intervals={$intervals.value}
				/>
				<Select
					value={timezone}
					values={timezones}
					itemId={(tz) => tz.tzCode}
					itemLabel={getTimezoneLabel}
					sm
					top
					class="flex-1"
				/>
			</div>
			<div class="add-links">
				<h2 class="text-headline">Any related links?</h2>
				<LinksTextfields
					bind:this={linksRef}
					bind:values={links}
					bind:errors={linkErrors}
				/>
			</div>
			<LoadingButton type="submit" color="gradient">Create meet</LoadingButton>
		</form>
	</div>
</section>

<style lang="postcss">
	.when {
		@apply w-full p-4 card;
		@apply flex flex-col gap-4;
	}

	:global(.adjust-button.open) {
		@apply text-primary-400;
	}

	.add-links {
		@apply flex flex-col gap-4 p-4 card;
	}
</style>
