<svelte:head>
	<title>meetwhen.io</title>
</svelte:head>

<script lang="ts">
  import { getContext } from 'svelte';
  import { slide } from 'svelte/transition';
  import { ArrowRightIcon, ChevronDownIcon } from 'svelte-feather-icons';
  import { goto } from '@sapper/app';
  import Accordian from '@my/components/Accordian.svelte';
  import type { INewEventName, IGetCrossfade } from './_layout.svelte';

  const newEventName = getContext<INewEventName>('newEventName');

  const getCrossfade = getContext<IGetCrossfade>('getCrossfade');
  const [send, receive] = getCrossfade();

  let findUrl = '';
  function find() {
    const slashIndex = findUrl.lastIndexOf('/');
    const path = findUrl.substring(slashIndex + 1);
    goto(`/${path}`);
  }
</script>

<div class="max-w-lg p-6 mx-auto space-y-4">

  <div
    in:receive={{key:'nav'}} out:send={{key:'nav'}}
    class="p-4 text-white card bg-gradient-primary"
    >
    <h1 class="text-xl font-bold">meetwhen</h1>
    <p class="text-sm">Find the perfect time to meet up with your team</p>
  </div>

  <div class="p-4 card space-y-4">
    <h2 in:receive={{key:'h2'}} out:send={{key:'h2'}}>
      Get started with a new event
    </h2>
    <form on:submit|preventDefault={() => goto('/new')} class="flex space-x-4">
      <input
        type="text"
        bind:value={$newEventName}
        placeholder="New event name..."
        in:receive={{key:'input'}} out:send={{key:'input'}}
        class="flex-1 textfield"
        >
      <button type="submit" class="rounded-full button primary icon">
        <ArrowRightIcon class="p-2"/>
      </button>
    </form>
  </div>

  <Accordian
    classx={({ expanded }) => expanded ? 'card' : ''}
    let:expanded
    >
    <div slot="title" class={`flex justify-between w-full p-4 ${expanded ? '' : 'card interactive'}`}>
      <h2>Find an event</h2>
      <ChevronDownIcon
        class={`p-2 -m-2 icon transition transform ${expanded ? 'rotate-180' : ''}`}
      />
    </div>
    <form
      on:submit|preventDefault={find}
      transition:slide|local class="flex p-4 pt-0 space-x-4"
      >
      <input
        type="text"
        bind:value={findUrl}
        placeholder="Event code..."
        class="flex-1 textfield"
        >
      <button type="submit" class="rounded-full button primary icon">
        <ArrowRightIcon class="p-2"/>
      </button>
    </form>
  </Accordian>

</div>

