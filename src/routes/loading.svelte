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
  import Buttons from './[slug]/_Buttons.svelte';
  import Calendar from './[slug]/_Calendar/Calendar.svelte';
  import Header from './[slug]/_Header.svelte';
  import Template from './[slug]/_Template.svelte';
  import type { Load } from '@sveltejs/kit';

  onMount(async () => {
    $newMeeting = await $loadingMeetingPromise;
    $loadingMeetingPromise = null;
    goto(`/${$newMeeting.slug}`, { replaceState: true });
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
