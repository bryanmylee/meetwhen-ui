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
	import { onDestroy, tick } from 'svelte';
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
	import { Button, LoadingButton } from '$lib/input';
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
	import { activeMeeting } from '$lib/core/state';
	import { setLoading, withLoading } from '$lib/loading';
	import { FirebaseError } from 'firebase/app';

	const auth = useAuth();
	const repo = useRepo();
	const currentUser = useUser();
	$: isGuest = $currentUser?.email?.endsWith('.guest');

	export let meeting: Id<Meeting>;

	$: $activeMeeting = meeting;
	onDestroy(() => {
		$activeMeeting = undefined;
	});

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

	const isLoading = writable(false);
	setLoading(isLoading);

	const handleJoin = () => {
		pageState = 'join';
	};

	const _confirmJoin = async () => {
		intervals.validate();
		// Wait on `errors` reactive update.
		await tick();
		if (errors.length !== 0) {
			console.error(errors);
			return;
		}
		if ($currentUser == null || $currentUser.ssr) {
			return handleGuestJoin();
		}
		await addScheduleToMeeting();
	};
	const confirmJoin = withLoading(isLoading, _confirmJoin);

	const addScheduleToMeeting = async () => {
		if ($currentUser == null || $currentUser.ssr) {
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
	let showPasscodeDialog = false;
	let passcode: Maybe<string> = undefined;
	$: if (!showPasscodeDialog) {
		passcode = undefined;
	}

	const handleGuestJoin = () => {
		showGuestJoinDialog = true;
	};

	const username = withError('');
	const _confirmGuestJoin = async () => {
		if ($currentUser != null) {
			return;
		}
		try {
			const joinResult = await guestJoin(auth, repo, {
				username: $username.value,
				meetingId: meeting.id,
			});
			showGuestJoinDialog = false;
			showPasscodeDialog = true;
			passcode = joinResult.passcode;
			await addScheduleToMeeting();
		} catch (error) {
			console.error(error);
			if (error instanceof FirebaseError) {
				$username.error = 'Name already taken';
			}
		}
	};
	const confirmGuestJoin = withLoading(isLoading, _confirmGuestJoin);

	const handleLeave = () => {
		pageState = 'leave';
	};

	const _confirmLeave = async () => {
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
		if ($currentUser.email?.endsWith('.guest')) {
			await confirmGuestLeave();
		}
		await deleteSchedule(repo, scheduleToDelete.id);
		pageState = 'none';
	};
	const confirmLeave = withLoading(isLoading, _confirmLeave);

	const _confirmGuestLeave = async () => {
		if ($currentUser == null || $currentUser.ssr) {
			return;
		}
		await guestLeave(auth, repo, {
			user: $currentUser,
		});
	};
	const confirmGuestLeave = withLoading(isLoading, _confirmGuestLeave);

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

	const _confirmEdit = async () => {
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
	const confirmEdit = withLoading(isLoading, _confirmEdit);
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
				<LoadingButton color="gradient" class="w-full" on:click={confirmJoin}>
					Confirm
				</LoadingButton>
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
				<LoadingButton color="gradient" class="w-full" on:click={confirmEdit}>
					Confirm
				</LoadingButton>
			</div>
		{:else if pageState === 'leave'}
			<div class="leave">
				<p class="text-center text-label">Are you sure you want to leave?</p>
				{#if isGuest}
					<p class="text-center text-label text-red-400">
						Your guest account will be deleted
					</p>
				{/if}
			</div>
			<div class="flex w-full gap-4">
				<Button
					color="gray"
					class="w-full"
					on:click={() => (pageState = 'none')}
				>
					Cancel
				</Button>
				<LoadingButton color="gradient" class="w-full" on:click={confirmLeave}>
					Confirm
				</LoadingButton>
			</div>
		{/if}
	</div>
</section>

<GuestJoinDialog
	{username}
	bind:open={showGuestJoinDialog}
	meetingSlug={meeting.slug}
	on:guest-join={confirmGuestJoin}
/>
<PasscodeDialog passcode={passcode ?? ''} bind:open={showPasscodeDialog} />

<style lang="postcss">
	.leave {
		@apply p-4 card;
	}
</style>
