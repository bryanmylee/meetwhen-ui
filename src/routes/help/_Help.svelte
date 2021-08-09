<script lang="ts">
  import { isDark } from '$lib/app-state';
</script>

<div class="flex flex-col items-center dark:text-white">
  <h2>Create meetings</h2>
  <img src="/about/new_{$isDark ? 'dark' : 'light'}.gif" alt="Create a new meet" />
  <h2>Join your friends</h2>
  <img src="/about/meeting_joining_{$isDark ? 'dark' : 'light'}.gif" alt="Join a meet" />
  <h2>Share with others</h2>
  <img src="/about/meeting_share_{$isDark ? 'dark' : 'light'}.gif" alt="Join a meet" />
</div>

<style lang="postcss">
  h2 {
    @apply font-medium px-4 pt-4 mt-2;
  }

  img {
    @apply rounded-xl;
  }
</style>
