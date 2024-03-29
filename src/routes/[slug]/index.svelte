<script lang="ts" context="module">
	export const load: Load = async ({ params, session }) => {
		const { slug } = params;
		const meeting = await findMeetingWithSlug(firebaseClient.repo, slug);
		if (meeting === undefined) {
			return {
				status: 404,
			};
		}
		const users = await fetchMeetingUserRecords(meeting.id);

		// check guest user meeting.
		let guestMeetingPreview: Maybe<Id<MeetingPreviewData>>;
		const { user } = session;
		if (user?.email?.endsWith('.guest')) {
			guestMeetingPreview = await fetchGuestMeetingPreview(user.uid);
		}

		return {
			props: {
				meetingId: meeting.id,
				initMeeting: meeting,
				users,
				guestMeetingPreview,
			},
		};
	};
</script>

<script lang="ts">
	import { onDestroy, tick } from 'svelte';
	import { writable } from 'svelte/store';
	import type { Load } from '@sveltejs/kit';
	import { doc } from 'firebase/firestore';
	import type {
		DocumentSnapshot,
		QueryDocumentSnapshot,
	} from 'firebase/firestore';
	import { signOut } from 'firebase/auth';
	import { MeetingConverter, ScheduleConverter } from '$lib/models';
	import type {
		Meeting,
		MeetingPreviewData,
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
	import { fetchGuestMeetingPreview, fetchMeetingUserRecords } from '$lib/api';
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

	const auth = useAuth();
	const repo = useRepo();
	const currentUser = useUser();
	$: $currentUser, (pageState = 'none');

	export let meetingId: string;
	export let initMeeting: Id<Meeting>;
	let meeting = initMeeting;

	$: $activeMeeting = meeting;
	onDestroy(() => {
		$activeMeeting = undefined;
	});

	const meetingDocRef = writable(doc(repo, 'meeting', meetingId));
	$: $meetingDocRef = doc(repo, 'meeting', meetingId);
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
		if ($currentUser?.ssr) {
			return;
		}
		intervals.validate();
		// Wait on `errors` reactive update.
		await tick();
		if (errors.length !== 0) {
			console.error(errors);
			return;
		}
		if ($currentUser == null) {
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
				intervals: $intervals.value,
			});
			showGuestJoinDialog = false;
			showPasscodeDialog = true;
			passcode = joinResult.passcode;
			pageState = 'none';
		} catch (error) {
			console.error(error);
			$username.error = 'Name already taken';
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
			return await confirmGuestLeave();
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
		pageState = 'none';
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

	export let guestMeetingPreview: Maybe<Id<MeetingPreviewData>>;
	let showGuestSignOutDialog = false;
	const checkGuest = () => {
		showGuestSignOutDialog =
			guestMeetingPreview !== undefined && guestMeetingPreview.id !== meetingId;
	};
	checkGuest();
	$: meetingId, checkGuest();

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

<section class="h-screen-nav">
	<div class="layout">
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
			class="time-picker"
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
				{#if guestMeetingPreview !== undefined}
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
<GuestSignOutDialog
	open={showGuestSignOutDialog}
	guestMeeting={guestMeetingPreview}
	on:sign-out={handleGuestSignOut}
/>

<style lang="postcss">
	.layout {
		@apply flex flex-col flex-1 w-full h-full max-w-xl gap-4 p-4 mx-auto;
		@media screen and (min-width: 1024px) {
			@apply grid items-start max-w-none;
			grid-template-columns: 384px auto;
			grid-template-rows: auto 1fr;
		}

		& :global(.time-picker) {
			@apply min-h-0 h-full;
			@apply lg:row-span-2;
		}
	}
	.leave {
		@apply p-4 card;
	}
</style>
