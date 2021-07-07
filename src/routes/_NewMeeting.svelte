<script lang="ts">
  import { goto } from '$app/navigation';
  import { receive, send } from '$lib/app-state';
  import { newMeetingName } from './new/_state/meeting';
  import Textfield from '$lib/components/Textfield.svelte';
  import { ArrowRightIcon } from 'svelte-feather-icons';
</script>

<section class="p-4 space-y-4 card">
  <h2>Get started with a new event</h2>
  <form on:submit|preventDefault={() => goto('/new')} class="flex items-center space-x-4">
    <div in:receive={{ key: 'new-name' }} out:send={{ key: 'new-name' }} class="flex-1">
      <Textfield bind:value={$newMeetingName} placeholder="Name your event" class="w-full" />
    </div>
    <button type="submit" aria-label="New meeting" class="w-10 h-10 rounded-full button primary">
      <ArrowRightIcon class="p-2" />
    </button>
  </form>
</section>
