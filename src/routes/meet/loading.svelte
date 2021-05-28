<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { loadingMeetingPromise, newMeeting } from '$lib/app-state';
  import { Chasing } from 'svelte-loading-spinners';
  import Head from '$lib/components/Head.svelte';
  import Buttons from './_Buttons.svelte';
  import Calendar from './_Calendar.svelte';
  import Header from './_Header.svelte';
  import Template from './_Template.svelte';

  onMount(async () => {
    $newMeeting = await $loadingMeetingPromise;
    $loadingMeetingPromise = null;
    goto(`/meet/${$newMeeting.slug}`, { replaceState: true });
  });
</script>

<Head emoji="📘" subtitle="loading..." />

<Template>
  <svelte:fragment slot="header">
    <Header />
  </svelte:fragment>
  <svelte:fragment slot="buttons">
    <Buttons />
  </svelte:fragment>
  <svelte:fragment slot="calendar">
    <Calendar />
  </svelte:fragment>
</Template>

<div class="fixed inset-0 flex items-center justify-center bg-gray-400 bg-opacity-50 text-primary">
  <Chasing color="currentColor" />
</div>
