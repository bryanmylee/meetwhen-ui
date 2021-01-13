<svelte:head>
  <title>meetwhen.io ⏳ loading...</title>
</svelte:head>

<script lang="ts" context="module">
  import { get } from 'svelte/store';
  import { event } from '@my/state/event';
  import type Common from '@sapper/common';

  export const preload: Common.Preload = async function(this, page, session) {
    const $event = get(event);
    if (!$event.pending && $event.data == null) {
      this.redirect(301, '/');
    }
  }
</script>

<script lang="ts">
  import { goto } from '@sapper/app';
  import Loader from '@my/components/Loader.svelte';
  import EventTemplate from './[eventUrl].svelte';

  $: if (!$event.pending && $event.data) {
    goto($event.data.eventUrl);
  }
</script>

<EventTemplate {...$event.data}/>

<div class="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50">
  <Loader class="w-16 h-16 text-primary"/>
</div>

