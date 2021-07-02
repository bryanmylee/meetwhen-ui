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

  export let meeting: Meeting;
  $: $meetingDep = meeting;

  const handleSubmit = async () => {
    try {
      if (!isFormatValid()) {
        return;
      }
      if ($pageState === 'joining') {
        if ($session.user === null) {
          // TODO: logging in / signing up if not authed.
          throw 'must be authenticated to join';
          return;
        }
        await submitAddSchedule();
      } else if ($pageState === 'editing') {
        if ($session.user === null) {
          throw 'must be authenticated to edit';
        }
        await submitEditSchedule();
      }
    } catch (errors) {
      console.error(errors);
      if (Array.isArray(errors)) {
        (errors as APIError[]).forEach(handleAPIError);
      }
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

  const submitAddSchedule = async () => {
    const schedule = await addSchedule($addScheduleVars);
    meeting.schedules.push(schedule as Schedule);
    $session.user = schedule.user;
    meeting = meeting;
    $pageState = 'none';
  };

  const submitEditSchedule = async () => {
    const newSchedule = await editSchedule($editScheduleVars);
    const currentSchedule = meeting.schedules.find(
      (schedule) => schedule.user.id === newSchedule.user.id
    );
    currentSchedule.intervals = newSchedule.intervals;
    meeting = meeting;
    $pageState = 'none';
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

  $: if ($session.user !== null) {
    $pageState === 'none';
  }

  let calendar: Calendar;

  $: if ($pageState === 'none') {
    resetForm();
    calendar?.reset();
  }

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
    <Buttons meetingId={meeting.id} slot="buttons" />
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
