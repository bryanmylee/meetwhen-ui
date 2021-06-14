<script lang="ts" context="module">
  export const load: Load = async ({ page }) => {
    const { slug } = page.params;
    const meeting = get(newMeeting) ?? (await getMeetingBySlug({ slug }));
    return {
      props: { meeting },
    };
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
  import { modalState, isEditing } from './_state/page';
  import {
    meeting as meetingDep,
    username,
    password,
    intervals,
    resetForm,
    addGuestScheduleVars,
    addScheduleVars,
    editScheduleVars,
    editGuestScheduleVars,
  } from './_state/form';
  import { newMeeting } from '$lib/app-state';
  import { session } from '$app/stores';
  import { addSchedule } from '$lib/gql/addSchedule';
  import { editSchedule } from '$lib/gql/editSchedule';
  import { editGuestSchedule } from '$lib/gql/editGuestSchedule';

  export let meeting: Meeting;
  $: $meetingDep = meeting;

  $: console.log($session);

  const handleSubmit = async () => {
    if (!isFormatValid()) {
      return;
    }
    try {
      if ($modalState === 'add-auth') {
        await submitAuthSchedule();
      } else if ($modalState === 'add-guest') {
        await submitGuestSchedule();
      } else if ($modalState === 'edit-auth') {
        await submitEditAuthSchedule();
      } else if ($modalState === 'edit-guest') {
        await submitEditGuestSchedule();
      } else if ($modalState === 'login-guest') {
        await submitLoginGuest();
      }
    } catch (errors) {
      (errors as APIError[]).forEach(handleAPIError);
    }
  };

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
    $session.guestUser = {
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

  const submitLoginGuest = async () => {};

  const handleAPIError = (error: APIError) => {
    const { id } = error.extensions.exception.details;
    console.error({ id, message: error.message });
    if (id === 'auth/email-already-exists') {
      $username.error = 'Username already taken';
    } else if (id === 'auth/invalid-password') {
      $password.error = 'Password must be at least 6 characters long';
    }
  };

  let calendar: Calendar;
  $: if (!$isEditing) {
    resetForm();
    calendar?.reset();
  }

  $: if ($modalState === 'edit-auth') {
    const currentSchedule = $meetingDep.schedules.find(
      (schedule) => schedule.user.id === $session.user?.id
    );
    calendar?.initializeWithSelected(currentSchedule.intervals);
  }
</script>

<Head emoji="📘" subtitle={meeting.name} />

<form on:submit|preventDefault={handleSubmit} class="contents">
  <Template>
    <Header name={meeting.name} slot="header" />
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
