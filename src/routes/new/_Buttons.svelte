<script lang="ts" context="module">
  export interface ButtonsEvent {
    more: never;
  }
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { session } from '$app/stores';
  import { MoreHorizontalIcon } from 'svelte-feather-icons';

  const dispatch = createEventDispatcher<ButtonsEvent>();
</script>

<section class="flex space-x-4">
  <button type="submit" class="w-full p-3 rounded-full button gradient card">Continue</button>
  <button
    type="button"
    aria-label="More settings"
    on:click={() => dispatch('more')}
    class="max-w-12 max-h-12 p-3 rounded-full button shade"
  >
    <MoreHorizontalIcon />
  </button>
</section>
