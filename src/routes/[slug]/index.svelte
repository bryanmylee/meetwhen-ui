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
				meetingId: meeting.id,
				initMeeting: meeting,
				users,
			},
		};
	};
</script>

<script lang="ts">
	import { onDestroy, onMount, tick } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import { writable } from 'svelte/store';
	import type { Load } from '@sveltejs/kit';
	import { doc } from 'firebase/firestore';
	import type {
		DocumentSnapshot,
		QueryDocumentSnapshot,
	} from 'firebase/firestore';
	import { FirebaseError } from 'firebase/app';
	import { signOut } from 'firebase/auth';
	import { MeetingConverter, ScheduleConverter } from '$lib/models';
	import type {
		Meeting,
		MeetingData,
		ScheduleData,
		UserRecord,
	} from '$lib/models';
	import {
		firebaseClient,
		useAuth,
		useRepo,
		useUser,
		useDynamicLiveDocument,
		useDynamicLiveQuery,
		findMeetingWithSlug,
		addSchedule,
		findAllSchedulesWithMeetingIdQuery,
		deleteSchedule,
		editSchedule,
	} from '$lib/firebase';
	import { withError } from '$lib/core/utils';
	import type { Interval } from '$lib/core/types';
	import { arrayNotEmpty } from '$lib/input/validation';
	import { Button, LoadingButton } from '$lib/input';
	import { MeetingHeader, ScheduleTimePicker } from '$lib/meeting/components';
	import type { MeetingPageState } from '$lib/meeting/types/MeetingPageState';
	import { setUsersCache } from '$lib/meeting/utils/usersCacheContext';
	import { fetchMeetingUserRecords } from '$lib/api';
	import Head from '$lib/core/components/Head.svelte';
	import {
		GuestJoinDialog,
		PasscodeDialog,
		GuestSignOutDialog,
		guestJoin,
		guestLeave,
	} from '$lib/auth';
	import { activeMeeting } from '$lib/core/state';
	import { setLoading, withLoading } from '$lib/loading';
	import { guestEmailInMeeting } from '$lib/meeting/utils/guestEmailInMeeting';

	const auth = useAuth();
	const repo = useRepo();
	const currentUser = useUser();
	$: isGuest = $currentUser?.email?.endsWith('.guest') ?? false;

	export let meetingId: string;
	export let initMeeting: Id<Meeting>;
	let meeting = initMeeting;

	$: $activeMeeting = meeting;
	onDestroy(() => {
		$activeMeeting = undefined;
	});

	const meetingDocRef = writable(doc(repo, 'meetings', meetingId));
	$: $meetingDocRef = doc(repo, 'meetings', meetingId);
	const liveMeetingDoc = useDynamicLiveDocument<MeetingData>(meetingDocRef);
	$: updateMeeting($liveMeetingDoc);
	const updateMeeting = (doc: Maybe<DocumentSnapshot<MeetingData>>) => {
		const data = doc?.data();
		if (data !== undefined) {
			meeting = {
				...meeting,
				...MeetingConverter.parse(data),
			};
		}
	};

	export let users: Id<UserRecord>[];
	const usersCache = writable<Record<string, UserRecord>>({});
	setUsersCache(usersCache);
	$: $usersCache = users.reduce((cache, { id, ...user }) => {
		return {
			...cache,
			[id]: user,
		};
	}, {});

	const schedulesQuery = writable(
		findAllSchedulesWithMeetingIdQuery(repo, meetingId),
	);
	$: $schedulesQuery = findAllSchedulesWithMeetingIdQuery(repo, meetingId);
	const liveSchedulesDocs = useDynamicLiveQuery<ScheduleData>(schedulesQuery);
	$: updateSchedules($liveSchedulesDocs);
	const updateSchedules = (
		docs: Maybe<QueryDocumentSnapshot<ScheduleData>[]>,
	) => {
		const schedules = docs
			?.map((d) => [d.id, d.data()] as const)
			.map(([id, data]) => ({ ...ScheduleConverter.parse(data), id }));
		if (schedules !== undefined) {
			meeting = {
				...meeting,
				schedules,
			};
		}
		updateUserData();
	};

	const updateUserData = async () => {
		users = await fetchMeetingUserRecords(meetingId);
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
				meetingId,
			},
			$currentUser,
		);
	};

	let showGuestJoinDialog = false;
	let showGuestSignOutDialog = false;
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
				meetingId,
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
				meetingId,
			},
			$currentUser,
		);
	};
	const confirmEdit = withLoading(isLoading, _confirmEdit);

	// sign out guest users when viewing this meeting as a guest from another meeting.
	const catchGuestUser = () => {
		if (
			$currentUser?.email != null &&
			isGuest &&
			!guestEmailInMeeting($currentUser.email, meetingId)
		) {
			showGuestSignOutDialog = true;
		}
	};
	onMount(catchGuestUser);
	afterNavigate(catchGuestUser);

	const _handleGuestSignOut = async () => {
		await signOut(auth);
		showGuestSignOutDialog = false;
	};
	const handleGuestSignOut = withLoading(isLoading, _handleGuestSignOut);
</script>

<Head
	noRobots
	emoji={meeting.emoji}
	subtitle={meeting.name}
	description={meeting.description}
/>

<section class="flex flex-col h-screen-nav">
	<div class="flex flex-col flex-1 w-full h-full max-w-xl gap-4 p-4 mx-auto">
		<MeetingHeader
			name={meeting.name}
			slug={meeting.slug}
			description={meeting.description}
			links={meeting.links}
		/>
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
{#if $currentUser != null && !$currentUser.ssr}
	<GuestSignOutDialog
		guestUser={$currentUser}
		open={showGuestSignOutDialog}
		on:sign-out={handleGuestSignOut}
	/>
{/if}

<style lang="postcss">
	.leave {
		@apply p-4 card;
	}
</style>
