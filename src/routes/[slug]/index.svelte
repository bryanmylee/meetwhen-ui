<script lang="ts" context="module">
  export const load: Load = async ({ page, session }) => {
    const { slug } = page.params;
    const meeting = get(newMeeting) ?? (await getMeetingBySlug({ slug }));
    if (session.user !== null && session.user.guestOf !== meeting.id.toLowerCase()) {
      await logout();
      session.user = null;
    }
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
  import { modalState, isEditing, ModalState } from './_state/page';
  import {
    meeting as meetingDep,
    username,
    password,
    intervals,
    resetForm,
    addGuestScheduleVars,
    addScheduleVars,
    editScheduleVars,
  } from './_state/form';
  import { newMeeting } from '$lib/app-state';
  import { session } from '$app/stores';
  import { addSchedule } from '$lib/gql/addSchedule';
  import { editSchedule } from '$lib/gql/editSchedule';
  import { logout } from '$lib/gql/logout';

  export let meeting: Meeting;
  $: $meetingDep = meeting;

  const handleSubmit = async () => {
    if (!isFormatValid()) {
      return;
    }
    try {
      if ($modalState === ModalState.ADD_AUTH || $modalState === ModalState.ADD_GUEST) {
        await submitNewSchedule();
      } else if ($modalState === ModalState.EDIT_AUTH) {
        await submitEditSchedule();
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

  const submitNewSchedule = async () => {
    const schedule =
      $session.user === null
        ? await addGuestSchedule($addGuestScheduleVars)
        : await addSchedule($addScheduleVars);
    meeting.schedules.push(schedule as Schedule);
    meeting = meeting;
    $modalState = ModalState.NONE;
    $session.user = schedule.user;
  };

  const submitEditSchedule = async () => {
    if ($session.user === null) {
      return;
    }
    const newSchedule = await editSchedule($editScheduleVars);
    const currentSchedule = meeting.schedules.find(
      (schedule) => schedule.user.id === newSchedule.user.id
    );
    currentSchedule.intervals = newSchedule.intervals;
    meeting = meeting;
    $modalState = ModalState.NONE;
  };

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

  $: if ($modalState === ModalState.EDIT_AUTH) {
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
