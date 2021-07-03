<script lang="ts" context="module">
  export const load: Load = async ({ page }) => {
    const { slug } = page.params;
    try {
      const meeting = get(newMeeting) ?? (await getMeetingBySlug({ slug }));
      activeMeeting.set(meeting as Meeting);
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
  import Calendar from './_Calendar/Calendar.svelte';
  import Head from '$lib/components/Head.svelte';
  import AuthModal from '$lib/components/AuthModal/AuthModal.svelte';
  import Header from './_Header.svelte';
  import Buttons from './_Buttons.svelte';
  import Template from './_Template.svelte';
  import type { APIError } from '$lib/typings/error';
  import type { Load } from '@sveltejs/kit';
  import type { Meeting, Schedule } from '$lib/gql/types';
  import { get } from 'svelte/store';
  import { getMeetingBySlug } from '$lib/gql/getMeetingBySlug';
  import { meeting as meetingDep, pageState, isEditing } from './_state/page';
  import {
    username,
    password,
    intervals,
    resetForm,
    addScheduleVars,
    editScheduleVars,
  } from './_state/form';
  import { activeMeeting, newMeeting } from '$lib/app-state';
  import { session } from '$app/stores';
  import { addSchedule } from '$lib/gql/addSchedule';
  import { editSchedule } from '$lib/gql/editSchedule';
  import { deleteSchedule } from '$lib/gql/deleteSchedule';

  export let meeting: Meeting;
  $: $meetingDep = meeting;

  const handleLeave = async () => {
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
  };

  const handleSubmit = async () => {
    if ($pageState === 'joining') {
      await handleJoin();
    } else if ($pageState === 'editing') {
      await handleEdit();
    }
  };

  let showAuthModal = false;
  let waitingToJoin = false;

  const dismissAuthModal = () => {
    showAuthModal = false;
    waitingToJoin = false;
  };

  $: if (!showAuthModal && waitingToJoin) {
    waitingToJoin = false;
    handleJoin();
  }

  const handleJoin = async () => {
    if (!isFormFormatValid()) {
      return;
    }
    try {
      // handleJoin() will be called again after dismissal of auth modal.
      if ($session.user === null) {
        showAuthModal = true;
        waitingToJoin = true;
        return;
      }
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
  };

  const handleEdit = async () => {
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
  };

  const isFormFormatValid = () => {
    let noFormatErrors = true;
    if ($intervals.value.length === 0) {
      noFormatErrors = false;
      $intervals.error = 'Required';
    }
    return noFormatErrors;
  };

  const handleAPIError = (error: APIError) => {
    console.log(error);
    const { id } = error.extensions.exception.details;
    if (id === 'auth/user-not-found') {
      $username.error = 'User not found';
    } else if (id === 'auth/email-already-exists') {
      $username.error = 'Username already taken';
    } else if (id === 'auth/wrong-password') {
      $password.error = 'Wrong password';
    } else if (id === 'auth/invalid-password') {
      $password.error = 'Password must be at least 6 characters long';
    } else if (id === 'auth/too-many-requests') {
      $password.error = 'Too many attempts';
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

<Head emoji="📘" subtitle={meeting.name} />

<form on:submit|preventDefault={handleSubmit} class="contents">
  <Template>
    <Header name={meeting.name} slug={meeting.slug} slot="header" />
    <Buttons on:join={handleJoin} on:edit={handleEdit} on:leave={handleLeave} slot="buttons" />
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
</form>

{#if showAuthModal}
  <AuthModal
    activeMeeting={meeting}
    isLoggingIn={false}
    isGuestAuth
    enableGuestLogin={false}
    on:dismiss={dismissAuthModal}
  />
{/if}
