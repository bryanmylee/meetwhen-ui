<script lang="ts">
  import { goto } from '$app/navigation';
  import { slide } from 'svelte/transition';
  import { ChevronDownIcon, ArrowRightIcon } from 'svelte-feather-icons';
  import Accordian from '$lib/components/Accordian.svelte';
  import Textfield from '$lib/components/Textfield.svelte';

  let findUrl = '';
  const find = () => {
    const slashIndex = findUrl.lastIndexOf('/');
    const href = findUrl.substring(slashIndex + 1);
    goto(href);
  };
</script>

<Accordian
  xclass={({ expanded }) => expanded && 'card'}
  xtitleclass={({ expanded }) =>
    'flex justify-between w-full p-4 card ' + (expanded && '!shadow-none rounded-b-none')}
  let:expanded
>
  <svelte:fragment slot="title">
    <h2>Find an event</h2>
    <ChevronDownIcon class="p-2 -m-2 w-10 h-10 transition transform {expanded && 'rotate-180'}" />
  </svelte:fragment>
  <form
    on:submit|preventDefault={find}
    transition:slide|local
    class="flex items-center p-4 pt-0 space-x-4"
  >
    <Textfield bind:value={findUrl} placeholder="Event Code" class="flex-1" />
    <button type="submit" class="w-10 h-10 rounded-full button primary">
      <ArrowRightIcon class="p-2" />
    </button>
  </form>
</Accordian>
