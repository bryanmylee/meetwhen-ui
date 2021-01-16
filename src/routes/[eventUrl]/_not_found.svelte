<script lang="ts">
  import { getContext } from 'svelte';
  import { ArrowRightIcon } from 'svelte-feather-icons';
  import { goto } from '@sapper/app';
  import type { IGetCrossfade, INewEventName } from '../_layout.svelte';

  export let eventUrl: string;

  const newEventName = getContext<INewEventName>('newEventName');

  const getCrossfade = getContext<IGetCrossfade>('getCrossfade');
  const [send, receive] = getCrossfade();
</script>

<div class="p-4 text-white card bg-gradient-primary">
  <h2 class="text-center">
    {eventUrl} not found
  </h2>
</div>

<div class="flex flex-col p-4 card space-y-4">
  <h2 in:receive={{key:'h2'}} out:send={{key:'h2'}}>
    Create a new event instead?
  </h2>
  <form on:submit|preventDefault={() => goto('/new')} class="flex space-x-4">
    <input
      type="text"
      bind:value={$newEventName}
      placeholder="..."
      in:receive={{key:'input'}} out:send={{key:'input'}}
      class="flex-1 textfield"
    >
    <button type="submit" class="rounded-full button primary icon">
      <ArrowRightIcon class="p-2"/>
    </button>
  </form>
</div>

