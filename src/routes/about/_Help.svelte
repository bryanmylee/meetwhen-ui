<script lang="ts">
  import { isDark } from '$lib/app-state';
  import Accordian from '$lib/components/Accordian.svelte';
  import { ChevronDownIcon } from 'svelte-feather-icons';
</script>

<Accordian
  xclass={() => 'flex flex-col items-center dark:text-white select-none'}
  xtitleclass={() =>
    'flex justify-between w-full p-4 card focus:outline-none focus:ring ring-inset ring-primary-lighter'}
  let:expanded
>
  <svelte:fragment slot="title">
    <h1 class="text-lg font-medium">Help</h1>
    <ChevronDownIcon class="p-2 -m-2 w-10 h-10 transition transform {expanded && 'rotate-180'}" />
  </svelte:fragment>
  <h2>Create meetings</h2>
  <img src="/about/new_{$isDark ? 'dark' : 'light'}.gif" alt="Create a new meet" />
  <h2>Join your friends</h2>
  <img src="/about/meeting_joining_{$isDark ? 'dark' : 'light'}.gif" alt="Join a meet" />
  <h2>Share with others</h2>
  <img src="/about/meeting_share_{$isDark ? 'dark' : 'light'}.gif" alt="Join a meet" />
</Accordian>

<style lang="postcss">
  h2 {
    @apply font-medium px-4 pt-4 mt-2;
  }

  img {
    @apply rounded-xl;
  }
</style>
