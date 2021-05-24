<script lang="ts">
  import { slide } from 'svelte/transition';
  import Textfield from '$lib/components/Textfield.svelte';
  import Header from './Header.svelte';
  import Tooltip from './Tooltip.svelte';

  let loggingIn = true;
  let hovering = false;
</script>

<div class="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
  <div class="p-4 space-y-4 card">
    <Header bind:loggingIn />
    {#if !loggingIn}
      <div transition:slide={{ duration: 200 }}>
        <Textfield placeholder="Name" class="block" />
      </div>
    {/if}
    <Textfield placeholder="Email" class="block" />
    <Textfield placeholder="Password" password class="block" />
    <div class="flex space-x-4">
      <button class="w-full p-3 button shade rounded-xl">Cancel</button>
      <button class="w-full p-3 button primary rounded-xl">Confirm</button>
    </div>
    <Tooltip bind:hovering />
  </div>
</div>
