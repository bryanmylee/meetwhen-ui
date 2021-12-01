<script lang="ts" context="module">
	export const load: Load = async ({ page }) => {
		const { slug } = page.params;
		try {
			const meeting = get(newMeeting) ?? (await getMeetingBySlug({ slug }));
			activeMeeting.set(meeting as Meeting);
			primaryColorBase.set(meeting.color);
			return {
				props: { meeting },
			};
		} catch (errors) {
			return {
				error: `${slug} not found`,
				status: 404,
			};
		}
	};
</script>

<script lang="ts">
	import AuthModal from '$lib/components/auth/organisms/AuthModal.svelte';
	import Buttons from '$lib/components/page-meeting/molecues/Buttons.svelte';
	import Calendar from '$lib/components/calendar/organisms/Calendar.svelte';
	import Head from '$lib/components/atoms/Head.svelte';
	import MeetingCard from '$lib/components/meetings/molecues/MeetingCard.svelte';
	import Template from '$lib/components/page-meeting/templates/Template.svelte';
	import type { APIError } from '$lib/typings/error';
	import type { AuthModalEvent } from '$lib/components/auth/organisms/AuthModal.svelte';
	import type { Load } from '@sveltejs/kit';
	import type { Meeting, Schedule } from '$lib/gql/types';
	import { activeMeeting, newMeeting, primaryColorBase } from '$lib/app-state';
	import { addSchedule } from '$lib/gql/addSchedule';
	import { browser } from '$app/env';
	import { deleteSchedule } from '$lib/gql/deleteSchedule';
	import { editSchedule } from '$lib/gql/editSchedule';
	import { get } from 'svelte/store';
	import { getMeetingBySlug } from '$lib/gql/getMeetingBySlug';
	import { intervals, resetForm, addScheduleVars, editScheduleVars } from './_state/form';
	import { logout } from '$lib/gql/logout';
	import { meeting as meetingDep, pageState, isEditing, isUserJoined } from './_state/page';
	import { onMount } from 'svelte';
	import { session } from '$app/stores';
	import { setLoadingContext, withLoading } from '$lib/components/loading/atoms';
	import { unionIntervals } from '$lib/utils/intervals';

	export let meeting: Meeting;
	$: $meetingDep = meeting;

	// logout previous guest if on wrong meeting.
	const validateGuestUser = async () => {
		if ($session.user === null) {
			return;
		}
		if ($session.user.guestOf === null) {
			return;
		}
		if ($session.user.guestOf !== meeting.id) {
			console.error('guest does not belong to this meeting');
			if (browser) {
				$session.user = null;
			}
			await logout();
		}
	};

	onMount(async () => {
		await validateGuestUser();
	});

	$: if (meeting.slug) {
		validateGuestUser();
	}

	const isLoading = setLoadingContext(false);

	const handleLeave = withLoading(isLoading, async () => {
		try {
			if ($session.user === null) {
				throw 'must be authenticated to leave';
			}
			await deleteSchedule({ meetingId: meeting.id });
			meeting = {
				...meeting,
				schedules: meeting.schedules.filter((schedule) => schedule.user.id !== $session.user.id),
			};
			if ($session.user.guestOf !== null) {
				$session.user = null;
			}
			$pageState = 'none';
		} catch (errors) {
			console.error(errors);
			if (Array.isArray(errors)) {
				(errors as APIError[]).forEach(handleAPIError);
			}
		}
	});

	let showAuthModal = false;

	const dismissAuthModal = ({ detail }: CustomEvent<AuthModalEvent['dismiss']>) => {
		showAuthModal = false;
		if (detail.authenticated) {
			handleJoin();
		}
	};

	const handleJoin = withLoading(isLoading, async () => {
		if (!isFormFormatValid()) {
			return;
		}
		try {
			// handleJoin() will be called again after dismissal of auth modal.
			if ($session.user === null) {
				showAuthModal = true;
				return;
			}
			// api error will be thrown if already-joined event is joined.
			const schedule = await addSchedule($addScheduleVars);
			meeting.schedules.push(schedule as Schedule);
			meeting = meeting;
			$session.user = schedule.user;
			$pageState = 'none';
		} catch (errors) {
			console.error(errors);
			if (Array.isArray(errors)) {
				(errors as APIError[]).forEach(handleAPIError);
			}
		}
	});

	const handleEdit = withLoading(isLoading, async () => {
		if (!isFormFormatValid()) {
			return;
		}
		try {
			if ($session.user === null) {
				throw 'must be authenticated to edit';
			}
			const newSchedule = await editSchedule($editScheduleVars);
			const currentSchedule = meeting.schedules.find(
				(schedule) => schedule.user.id === newSchedule.user.id
			);
			currentSchedule.intervals = newSchedule.intervals;
			meeting = meeting;
			$pageState = 'none';
		} catch (errors) {
			console.error(errors);
			if (Array.isArray(errors)) {
				(errors as APIError[]).forEach(handleAPIError);
			}
		}
	});

	const isFormFormatValid = () => {
		let noFormatErrors = true;
		if ($intervals.value.length === 0) {
			noFormatErrors = false;
			$intervals.error = 'Required';
		}
		return noFormatErrors;
	};

	const handleAPIError = (error: APIError) => {
		console.error(error);
		const { id } = error.extensions.exception.details;
		if (id === 'already-exists') {
			// merge current selection intervals with current user's intervals.
			const currentSchedule = meeting.schedules.find(
				(schedule) => schedule.user.id === $session.user.id
			);
			$intervals.value = unionIntervals([...$intervals.value, ...currentSchedule.intervals]);
			handleEdit();
		}
	};

	// if a user logs in, reset the page state.
	$: if ($session.user !== null) {
		$pageState === 'none';
	}

	let calendar: Calendar;

	// if the page state is reset, reset the form and calendar.
	$: if ($pageState === 'none') {
		resetForm();
		calendar?.reset();
	}

	// initialize the calendar with the current user's schedule.
	$: if ($pageState === 'editing') {
		const currentSchedule = $meetingDep.schedules.find(
			(schedule) => schedule.user.id === $session.user?.id
		);
		calendar?.initializeWithSelected(currentSchedule.intervals);
	}
</script>

<Head emoji={meeting.emoji} subtitle={meeting.name} noRobots />

<Template>
	<MeetingCard {meeting} slot="header" />
	<Buttons
		bind:pageState={$pageState}
		isUserJoined={$isUserJoined}
		on:join={handleJoin}
		on:edit={handleEdit}
		on:leave={handleLeave}
		slot="buttons"
	/>
	<Calendar
		bind:this={calendar}
		intervals={meeting.intervals}
		bind:selectedIntervals={$intervals.value}
		error={$intervals.error}
		schedules={meeting.schedules}
		disabled={!$isEditing}
		slot="calendar"
	/>
</Template>

{#if showAuthModal}
	<AuthModal
		activeMeeting={meeting}
		isLoggingIn={false}
		isGuestAuth
		enableGuestLogin={false}
		on:dismiss={dismissAuthModal}
	/>
{/if}
