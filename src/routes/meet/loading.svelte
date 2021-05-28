<script lang="ts">
  import { media } from '$lib/media';
  import Head from '$lib/components/Head.svelte';
</script>

<Head emoji="📘" subtitle="test event" />

{#if $media.md}
  <div class="flex p-6 mx-auto space-x-4 bg-gray-100 h-screen-nav max-w-7xl">
    <div class="space-y-4 min-w-72">
      <div class="p-4 bg-red-400">test event</div>
      <div class="flex space-x-4 bg-yellow-400">
        <button class="w-full p-3 button shade rounded-xl">Login</button>
        <button class="w-full p-3 button gradient rounded-xl">Join as Guest</button>
      </div>
    </div>
    <div class="flex-1 overflow-hidden bg-green-400">2</div>
  </div>
{:else}
  <div class="flex flex-col max-w-lg p-6 mx-auto space-y-4 bg-gray-100 h-screen-nav">
    <div class="p-4 bg-red-400">test event</div>
    <div class="flex-1 overflow-hidden bg-green-400">2</div>
    <div class="flex space-x-4 bg-yellow-400">
      <button class="w-full p-3 button shade rounded-xl">Login</button>
      <button class="w-full p-3 button gradient rounded-xl">Join as Guest</button>
    </div>
  </div>
{/if}
