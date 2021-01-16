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
  }

</script>

<script lang="ts">
  import { primaryBase } from '@my/state/colors';
  import EventPage from '@my/components/EventPage.svelte';
  import Loader from '@my/components/Loader.svelte';

  let title = '';
  $: if ($event.data) {
    title = `📘 ${$event.data.name}`;
    $primaryBase = $event.data.color;
  } else if ($event.pending) {
    title = '⏳ loading...';
  } else {
    title = '🗞 not foud';
  }
</script>

<div class="relative flex flex-col h-screen max-w-lg p-6 pt-20 mx-auto space-y-4">
  {#if $event.pending}
    <EventPage/>
    <div class="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50">
      <Loader class="w-16 h-16 text-primary"/>
    </div>
  {:else if $event.data}
    <EventPage {...$event.data}/>
  {:else}
    Not found.
  {/if}
</div>

