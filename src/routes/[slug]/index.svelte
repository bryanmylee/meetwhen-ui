<script lang="ts" context="module">
	export const load: Load = async ({ params }) => {
		const { slug } = params;
		const meeting = await findMeetingWithSlug(firebaseClient.repo, slug);
		if (meeting === undefined) {
			return {
				status: 404,
			};
		}
		const users = await fetchMeetingUserRecords(meeting.id);
		return {
			props: {
				meeting,
				users,
			},
		};
	};
</script>

<script lang="ts">
	import { tick } from 'svelte';
	import { writable } from 'svelte/store';
	import type { Load } from '@sveltejs/kit';
	import { doc } from 'firebase/firestore';
	import { MeetingConverter } from '$lib/models/Meeting';
	import type { Meeting, MeetingData } from '$lib/models/Meeting';
	import { ScheduleConverter } from '$lib/models/Schedule';
	import type { ScheduleData } from '$lib/models/Schedule';
	import type { Id } from '$lib/core/types/Id';
	import { firebaseClient } from '$lib/firebase/client';
	import { useAuth, useRepo, useUser } from '$lib/firebase/context';
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
	import { editSchedule } from '$lib/firebase/mutations/editSchedule';
	import { fetchMeetingUserRecords } from '$lib/api/fetchMeetingUserRecords';
	import type { UserRecord } from '$lib/models/UserRecord';
	import { setUsersCache } from '$lib/meeting/utils/usersCacheContext';
	import Head from '$lib/core/components/Head.svelte';
	import {
		GuestJoinDialog,
		PasscodeDialog,
		guestJoin,
		guestLeave,
	} from '$lib/auth';
	import type { Maybe } from '$lib/core/types/Maybe';

	const auth = useAuth();
	const repo = useRepo();
	const currentUser = useUser();

	export let meeting: Id<Meeting>;

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

	export let users: Id<UserRecord>[];
	const usersCache = writable<Record<string, UserRecord>>({});
	setUsersCache(usersCache);
	$: $usersCache = users.reduce((cache, { id, ...user }) => {
		return {
			...cache,
			[id]: user,
		};
	}, {});

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
		updateUserData();
	}

	const updateUserData = async () => {
		users = await fetchMeetingUserRecords(meeting.id);
	};

	let pageState: MeetingPageState = 'none';
	$: isJoined =
		$currentUser != null &&
		meeting.schedules !== undefined &&
		meeting.schedules.map((s) => s.userId).includes($currentUser.uid);

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
		if ($currentUser == null || $currentUser.ssr) {
			return handleGuestJoin();
		}
		addScheduleToMeeting();
	};

	const addScheduleToMeeting = async () => {
		if ($currentUser == null || $currentUser.ssr) {
			return;
		}
		intervals.validate();
		// Wait on `errors` reactive update.
		await tick();
		if (errors.length !== 0) {
			console.error(errors);
			return;
		}
		pageState = 'none';
		await addSchedule(
			repo,
			{
				intervals: $intervals.value,
				meetingId: meeting.id,
			},
			$currentUser,
		);
	};

	let showGuestJoinDialog = false;
	let showPasscodeDialog: Maybe<string> = undefined;
	const handleGuestJoin = () => {
		showGuestJoinDialog = true;
	};

	const confirmGuestJoin = async (username: string) => {
		if ($currentUser != null) {
			return;
		}
		const { passcode } = await guestJoin(auth, repo, {
			username,
			meetingId: meeting.id,
		});
		showGuestJoinDialog = false;
		showPasscodeDialog = passcode;
		await addScheduleToMeeting();
	};

	const handleLeave = () => {
		pageState = 'leave';
	};

	const confirmLeave = async () => {
		if ($currentUser == null || $currentUser.ssr) {
			return;
		}
		const userId = $currentUser.uid;
		const scheduleToDelete = meeting.schedules?.find(
			(s) => s.userId === userId,
		);
		if (scheduleToDelete === undefined) {
			return;
		}
		pageState = 'none';
		if ($currentUser.email?.endsWith('.guest')) {
			await confirmGuestLeave();
		}
		await deleteSchedule(repo, scheduleToDelete.id);
	};

	const confirmGuestLeave = async () => {
		if ($currentUser == null || $currentUser.ssr) {
			return;
		}
		guestLeave(auth, repo, {
			user: $currentUser,
		});
	};

	const handleEdit = () => {
		if (!isJoined) {
			return;
		}
		const currentSchedule = meeting.schedules?.find(
			(s) => s.userId === $currentUser?.uid,
		);
		if (currentSchedule === undefined) {
			return;
		}
		pageState = 'edit';
		$intervals.value = currentSchedule.intervals;
	};

	const confirmEdit = async () => {
		if ($currentUser == null || $currentUser.ssr) {
			return;
		}
		const currentSchedule = meeting.schedules?.find(
			(s) => s.userId === $currentUser?.uid,
		);
		if (currentSchedule === undefined) {
			return;
		}
		intervals.validate();
		// Wait on `errors` reactive update.
		await tick();
		if (errors.length !== 0) {
			console.error(errors);
			return;
		}
		pageState = 'none';
		await editSchedule(
			repo,
			{
				id: currentSchedule.id,
				intervals: $intervals.value,
				meetingId: meeting.id,
			},
			$currentUser,
		);
	};
</script>

<Head
	noRobots
	emoji={meeting.emoji}
	subtitle={meeting.name}
	description={meeting.description}
/>

<section class="flex flex-col h-screen-nav">
	<div class="flex flex-col flex-1 w-full h-full max-w-xl gap-4 p-4 mx-auto">
		<MeetingHeader {...meeting} />
		<ScheduleTimePicker
			bind:value={$intervals.value}
			error={$intervals.error}
			validIntervals={meeting.intervals}
			schedules={meeting.schedules}
			editing={pageState === 'join' || pageState === 'edit'}
			class="min-h-0 h-full"
		/>
		{#if pageState === 'none'}
			{#if isJoined}
				<div class="flex w-full gap-4">
					<Button color="gray" class="w-full" on:click={handleLeave}>
						Leave
					</Button>
					<Button class="w-full" on:click={handleEdit}>Edit</Button>
				</div>
			{:else}
				<Button color="gradient" on:click={handleJoin}>Join</Button>
			{/if}
		{:else if pageState === 'join'}
			<div class="flex w-full gap-4">
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
		{:else if pageState === 'edit'}
			<div class="flex w-full gap-4">
				<Button
					color="gray"
					class="w-full"
					on:click={() => (pageState = 'none')}
				>
					Cancel
				</Button>
				<Button color="gradient" class="w-full" on:click={confirmEdit}>
					Confirm
				</Button>
			</div>
		{:else if pageState === 'leave'}
			<div class="leave">
				<p class="text-center text-label">Are you sure you want to leave?</p>
			</div>
			<div class="flex w-full gap-4">
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

<GuestJoinDialog
	open={showGuestJoinDialog}
	on:cancel={() => (showGuestJoinDialog = false)}
	on:guest-join={({ detail }) => confirmGuestJoin(detail.username)}
	meetingSlug={meeting.slug}
/>
<PasscodeDialog
	passcode={showPasscodeDialog ?? ''}
	open={showPasscodeDialog !== undefined}
	on:dismiss={() => (showPasscodeDialog = undefined)}
/>

<style lang="postcss">
	.leave {
		@apply p-4 card;
	}
</style>
