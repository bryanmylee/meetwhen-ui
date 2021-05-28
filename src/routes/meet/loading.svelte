<script lang="ts" context="module">
  export const load: Load = async () => {
    if (get(loadingMeetingPromise) === null) {
      return {
        status: 302,
        redirect: '/',
      };
    }
    return {};
  };
</script>

<script lang="ts">
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { goto } from '$app/navigation';
  import { loadingMeetingPromise, newMeeting } from '$lib/app-state';
  import { ScaleOut } from 'svelte-loading-spinners';
  import Head from '$lib/components/Head.svelte';
  import Buttons from './_Buttons.svelte';
  import Calendar from './_Calendar.svelte';
  import Header from './_Header.svelte';
  import Template from './_Template.svelte';
  import type { Load } from '@sveltejs/kit';

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
  <ScaleOut color="currentColor" duration="1.5s" size="120" />
</div>
