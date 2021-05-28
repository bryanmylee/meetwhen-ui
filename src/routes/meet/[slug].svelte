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
  import type { Meeting } from '$lib/gql/types/meeting';
  import Head from '$lib/components/Head.svelte';
  import Buttons from './_Buttons.svelte';
  import Calendar from './_Calendar.svelte';
  import Header from './_Header.svelte';
  import Template from './_Template.svelte';

  export let meeting: Meeting;
</script>

<Head emoji="📘" subtitle={meeting.name} />

<Template>
  <svelte:fragment slot="header">
    <Header name={meeting.name} />
  </svelte:fragment>
  <svelte:fragment slot="buttons">
    <Buttons />
  </svelte:fragment>
  <svelte:fragment slot="calendar">
    <Calendar />
  </svelte:fragment>
</Template>
