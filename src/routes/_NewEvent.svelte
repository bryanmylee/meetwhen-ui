<script lang="ts">
  import { goto } from '$app/navigation';
  import { newEventName } from '$lib/state';
  import Textfield from '$lib/components/Textfield.svelte';
  import { ArrowRightIcon } from 'svelte-feather-icons';
</script>

<div class="p-4 space-y-4 card">
  <h2>Get started with a new event</h2>
  <form on:submit|preventDefault={() => goto('/new')} class="flex items-center space-x-4">
    <Textfield bind:value={$newEventName} placeholder="Name your event" class="flex-1" />
    <button type="submit" class="w-10 h-10 rounded-full button primary">
      <ArrowRightIcon class="p-2" />
    </button>
  </form>
</div>
