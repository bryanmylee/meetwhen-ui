<script lang="ts" context="module">
	export const load: Load = async ({ params }) => {
		const { slug } = params;
		const meeting = await findMeetingWithSlug(firebaseClient.repo, slug);
		return {
			props: {
				meeting,
			},
		};
	};
</script>

<script lang="ts">
	import { tick } from 'svelte';
	import type { Load } from '@sveltejs/kit';
	import { doc } from 'firebase/firestore';
	import { MeetingConverter } from '$lib/models/Meeting';
	import type { Meeting, MeetingData } from '$lib/models/Meeting';
	import { ScheduleConverter } from '$lib/models/Schedule';
	import type { ScheduleData } from '$lib/models/Schedule';
	import type { Id } from '$lib/core/types/Id';
	import { firebaseClient } from '$lib/firebase/client';
	import { useRepo, useUser } from '$lib/firebase/context';
	import { useLiveDocument } from '$lib/firebase/utils/useLiveDocument';
	import { useLiveQuery } from '$lib/firebase/utils/useLiveQuery';
	import { findMeetingWithSlug } from '$lib/firebase/queries/meetings';
	import { MeetingHeader, ScheduleTimePicker } from '$lib/meeting/components';
	import { withError } from '$lib/core/utils/withError';
	import type { Interval } from '$lib/core/types/Interval';
	import { arrayNotEmpty } from '$lib/input/utils/validation/arrayNotEmpty';
	import { Button } from '$lib/input';
	import type { MeetingPageState } from '$lib/meeting/types/MeetingPageState';
	import { addSchedule } from '$lib/firebase/mutations/addSchedule';
	import { findAllSchedulesWithMeetingIdQuery } from '$lib/firebase/queries/schedules/findAllSchedulesWithMeetingId';
	import { deleteSchedule } from '$lib/firebase/mutations/deleteSchedule';

	const repo = useRepo();
	const currentUser = useUser();

	export let meeting: Id<Meeting>;
	$: console.log(meeting);

	const liveMeetingDoc = useLiveDocument<MeetingData>(
		doc(repo, 'meetings', meeting.id),
	);
	$: {
		const data = $liveMeetingDoc?.data();
		if (data !== undefined) {
			meeting = {
				...meeting,
				...MeetingConverter.parse(data),
			};
		}
	}

	const liveSchedulesDocs = useLiveQuery<ScheduleData>(
		findAllSchedulesWithMeetingIdQuery(repo, meeting.id),
	);
	$: {
		const schedules = $liveSchedulesDocs
			?.map((d) => [d.id, d.data()] as const)
			.map(([id, data]) => ({ ...ScheduleConverter.parse(data), id }));
		if (schedules !== undefined) {
			meeting = {
				...meeting,
				schedules,
			};
		}
	}

	let pageState: MeetingPageState = 'none';
	$: isJoined =
		$currentUser !== undefined &&
		meeting.schedules !== undefined &&
		meeting.schedules.map((s) => s.userId).includes($currentUser?.uid);

	const intervals = withError<Interval[]>([], {
		validators: [
			arrayNotEmpty({ errorMessage: 'Select one or more intervals' }),
		],
	});

	$: errors = [...$intervals.errors];

	const handleJoin = () => {
		pageState = 'join';
	};

	const confirmJoin = async () => {
		if ($currentUser === undefined || $currentUser?.ssr) {
			return;
		}
		intervals.validate();
		// Wait on `errors` reactive update.
		await tick();
		if (errors.length !== 0) {
			console.error(errors);
			return;
		}
		await addSchedule(
			repo,
			{
				intervals: $intervals.value,
				meetingId: meeting.id,
			},
			$currentUser,
		);
		pageState = 'none';
	};

	const handleLeave = () => {
		pageState = 'leave';
	};

	const confirmLeave = async () => {
		if ($currentUser === undefined || $currentUser?.ssr) {
			return;
		}
		const userId = $currentUser.uid;
		const scheduleToDelete = meeting.schedules?.find(
			(s) => s.userId === userId,
		);
		if (scheduleToDelete === undefined) {
			return;
		}
		await deleteSchedule(repo, scheduleToDelete.id);
		pageState = 'none';
	};
</script>

<section>
	<div class="max-w-xl p-4 mx-auto flex flex-col gap-4">
		<MeetingHeader {...meeting} />
		<ScheduleTimePicker
			bind:value={$intervals.value}
			error={$intervals.error}
			validIntervals={meeting.intervals}
			schedules={meeting.schedules}
			editing={pageState === 'join' || pageState === 'edit'}
		/>
		{#if pageState === 'none'}
			{#if isJoined}
				<Button on:click={handleLeave}>Leave</Button>
			{:else}
				<Button color="gradient" on:click={handleJoin}>Join</Button>
			{/if}
		{:else if pageState === 'join'}
			<div class="w-full flex gap-4">
				<Button
					color="gray"
					class="w-full"
					on:click={() => (pageState = 'none')}
				>
					Cancel
				</Button>
				<Button color="gradient" class="w-full" on:click={confirmJoin}>
					Confirm
				</Button>
			</div>
		{:else if pageState === 'leave'}
			<div class="w-full flex gap-4">
				<Button
					color="gray"
					class="w-full"
					on:click={() => (pageState = 'none')}
				>
					Cancel
				</Button>
				<Button color="gradient" class="w-full" on:click={confirmLeave}>
					Confirm
				</Button>
			</div>
		{/if}
	</div>
</section>
