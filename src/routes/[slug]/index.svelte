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
  import { newMeeting } from '$lib/app-state';
  import { getMeetingBySlug } from '$lib/gql/getMeetingBySlug';
  import type { Load } from '@sveltejs/kit';
  import type { Meeting } from '$lib/gql/types';
  import Head from '$lib/components/Head.svelte';
  import Calendar from './_Calendar/Calendar.svelte';
  import Header from './_Header.svelte';
  import Modal from './_Modal.svelte';
  import Template from './_Template.svelte';
  import { isEditing } from './_state/page';
  import { intervals, resetForm } from './_state/form';

  export let meeting: Meeting;
  $: console.log(meeting);

  const submit = () => {
    console.log('submitted');
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
