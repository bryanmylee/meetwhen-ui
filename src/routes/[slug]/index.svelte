<script lang="ts" context="module">
  export const load: Load = async ({ page }) => {
    const { slug } = page.params;
    try {
      const meeting = get(newMeeting) ?? (await getMeetingBySlug({ slug }));
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
  import Header from './_Header.svelte';
  import Modal from './_Modal.svelte';
  import Template from './_Template.svelte';
  import type { APIError } from '$lib/typings/error';
  import type { Load } from '@sveltejs/kit';
  import type { Meeting, Schedule } from '$lib/gql/types';
  import { addGuestSchedule } from '$lib/gql/addGuestSchedule';
  import { get } from 'svelte/store';
  import { getMeetingBySlug } from '$lib/gql/getMeetingBySlug';
  import { meeting as meetingDep, modalState, isEditing, guestUser } from './_state/page';
  import {
    username,
    password,
    intervals,
    resetForm,
    addGuestScheduleVars,
    addScheduleVars,
    editScheduleVars,
    editGuestScheduleVars,
    loginGuestVars,
  } from './_state/form';
  import { newMeeting } from '$lib/app-state';
  import { session } from '$app/stores';
  import { addSchedule } from '$lib/gql/addSchedule';
  import { editSchedule } from '$lib/gql/editSchedule';
  import { editGuestSchedule } from '$lib/gql/editGuestSchedule';
  import { loginGuest } from '$lib/gql/loginGuest';

  export let meeting: Meeting;
  $: $meetingDep = meeting;

  const handleSubmit = async () => {
    try {
      if ($modalState === 'login-guest') {
        await submitLoginGuest();
        return;
      }
      if (!isFormatValid()) {
        return;
      }
      if ($modalState === 'add-auth') {
        await submitAuthSchedule();
      } else if ($modalState === 'add-guest') {
        await submitGuestSchedule();
      } else if ($modalState === 'edit-auth') {
        await submitEditAuthSchedule();
      } else if ($modalState === 'edit-guest') {
        await submitEditGuestSchedule();
      }
    } catch (errors) {
      (errors as APIError[]).forEach(handleAPIError);
    }
  };

  const submitLoginGuest = async () => {
    $guestUser = await loginGuest($loginGuestVars);
    $modalState = 'none';
  };

  $: if ($session.user !== null) {
    $guestUser = null;
  }

  const isFormatValid = () => {
    let noFormatErrors = true;
    if ($intervals.value.length === 0) {
      noFormatErrors = false;
      $intervals.error = 'Required';
    }
    return noFormatErrors;
  };

  const submitAuthSchedule = async () => {
    const schedule = await addSchedule($addScheduleVars);
    meeting.schedules.push(schedule as Schedule);
    $session.user = schedule.user;
    meeting = meeting;
    $modalState = 'none';
  };

  const submitGuestSchedule = async () => {
    const { token, ...schedule } = await addGuestSchedule($addGuestScheduleVars);
    meeting.schedules.push(schedule as Schedule);
    $guestUser = {
      token,
      ...schedule.user,
    };
    meeting = meeting;
    $modalState = 'none';
  };

  const submitEditAuthSchedule = async () => {
    const newSchedule = await editSchedule($editScheduleVars);
    const currentSchedule = meeting.schedules.find(
      (schedule) => schedule.user.id === newSchedule.user.id
    );
    currentSchedule.intervals = newSchedule.intervals;
    meeting = meeting;
    $modalState = 'none';
  };

  const submitEditGuestSchedule = async () => {
    const newSchedule = await editGuestSchedule($editGuestScheduleVars);
    const currentSchedule = meeting.schedules.find(
      (schedule) => schedule.user.id === newSchedule.user.id
    );
    currentSchedule.intervals = newSchedule.intervals;
    meeting = meeting;
    $modalState = 'none';
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
    }
  };

  let calendar: Calendar;

  $: if ($modalState === 'none') {
    resetForm();
    calendar?.reset();
  }

  $: if ($modalState === 'edit-auth') {
    const currentSchedule = $meetingDep.schedules.find(
      (schedule) => schedule.user.id === $session.user?.id
    );
    calendar?.initializeWithSelected(currentSchedule.intervals);
  }

  $: if ($modalState === 'edit-guest') {
    const currentSchedule = $meetingDep.schedules.find(
      (schedule) => schedule.user.id === $guestUser?.id
    );
    calendar?.initializeWithSelected(currentSchedule.intervals);
  }
</script>

<Head emoji="📘" subtitle={meeting.name} />

<form on:submit|preventDefault={handleSubmit} class="contents">
  <Template>
    <Header name={meeting.name} slug={meeting.slug} slot="header" />
    <Modal slot="modal" />
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
