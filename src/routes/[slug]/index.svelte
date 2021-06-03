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
  import { get } from 'svelte/store';
  import { session } from '$app/stores';
  import { newMeeting } from '$lib/app-state';
  import { getMeetingBySlug } from '$lib/gql/getMeetingBySlug';
  import { isEditing } from './_state/page';
  import { meetingId, intervals, resetForm, addGuestScheduleVars } from './_state/form';
  import type { Load } from '@sveltejs/kit';
  import type { Meeting, Schedule } from '$lib/gql/types';
  import Head from '$lib/components/Head.svelte';
  import Calendar from './_Calendar/Calendar.svelte';
  import Header from './_Header.svelte';
  import Modal from './_Modal.svelte';
  import Template from './_Template.svelte';
  import { addGuestSchedule } from '$lib/gql/addGuestSchedule';

  export let meeting: Meeting;
  $: $meetingId = meeting.id;
  $: console.log(meeting);

  const submit = async () => {
    if ($session.user === null) {
      const schedule = await addGuestSchedule($addGuestScheduleVars);
      meeting.schedules.push(schedule as Schedule);
      meeting = meeting;
    }
  };

  let calendar: Calendar;
  $: if (!$isEditing) {
    resetForm();
    calendar?.reset();
  }
</script>

<Head emoji="📘" subtitle={meeting.name} />

<form on:submit|preventDefault={submit} class="contents">
  <Template>
    <Header name={meeting.name} slot="header" />
    <Modal slot="modal" />
    <Calendar
      bind:this={calendar}
      intervals={meeting.intervals}
      bind:selectedIntervals={$intervals.value}
      disabled={!$isEditing}
      slot="calendar"
    />
  </Template>
</form>
