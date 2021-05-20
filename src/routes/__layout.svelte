<script lang="ts" context="module">
  export type INewEventName = Writable<string>;
</script>

<script lang="ts">
  import '../app.postcss';
  import '$lib/colors';
  import { setContext } from 'svelte';
  import { writable } from 'svelte/store';
  import type { Writable } from 'svelte/store';
  import { page } from '$app/stores';
  import PageTransition from '$lib/components/PageTransition.svelte';
  import Nav from './_nav.svelte';

  setContext('new-event-name', writable(''));
</script>

<PageTransition key={$page.path}>
  <slot />
</PageTransition>

{#if $page.path !== '/'}
  <Nav />
{/if}
