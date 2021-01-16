<svelte:head>
  <title>meetwhen.io {title}</title>
  <meta name="robots" content="noindex"/>
</svelte:head>

<script lang="ts" context="module">
  import { get } from 'svelte/store';
  import { auth } from '@my/state/auth';
  import { event } from '@my/state/event';
  import type Common from '@sapper/common';

  export const preload: Common.Preload = async function(this, page, session) {
    const { eventUrl } = page.params;
    const $event = get(event);
    if ($event.pending) {
      this.redirect(301, '/event');
    }
    if ($event.data == null || $event.data.eventUrl !== eventUrl) {
      event.get(eventUrl);
    }
    return { eventUrl };
  }

</script>

<script lang="ts">
  import { onMount } from 'svelte';
  import { primaryBase } from '@my/state/colors';
  import Loader from '@my/components/Loader.svelte';
  import EventNotFound from './_not_found.svelte';
  import EventPage from './_found.svelte';

  let title = '';
  $: if ($event.data) {
    title = `📘 ${$event.data.name}`;
    $primaryBase = $event.data.color;
  } else if ($event.pending) {
    title = '⏳ loading...';
  } else {
    title = '🗞 not found';
  }

  export let eventUrl: string;

  onMount(() => {
    if ($event.pending || $event.data?.eventUrl === eventUrl) return;
    event.get(eventUrl);
  });
</script>

<div class="relative flex flex-col h-screen max-w-lg p-6 pt-20 mx-auto space-y-4">
  {#if $event.data}
    <EventPage {...$event.data}/>
    {#if $event.pending || $auth.pending}
      <div class="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50">
        <Loader class="w-16 h-16 text-primary"/>
      </div>
    {/if}
  {:else}
    {#if $event.pending}
      <EventPage/>
      <div class="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50">
        <Loader class="w-16 h-16 text-primary"/>
      </div>
    {:else}
      <EventNotFound {eventUrl}/>
    {/if}
  {/if}
</div>

