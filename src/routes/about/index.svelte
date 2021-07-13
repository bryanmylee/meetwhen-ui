<script lang="ts">
  import { isDark } from '$lib/app-state';
</script>

<article class="max-w-lg p-6 mx-auto space-y-4">
  <section class="card p-4 space-y-2">
    <h1 class="text-lg font-medium">About</h1>
    <p>
      <span class="font-bold text-gradient-primary">meetwhen</span> makes group meetings quick and easy!
    </p>
  </section>
  <section class="card p-4 space-y-2">
    <h2 class="font-medium">Create meetings</h2>
  </section>
  <img src="/about/new_{$isDark ? 'dark' : 'light'}.png" alt="Create a new meet" />
  <section class="card p-4 space-y-2">
    <h2 class="font-medium">Join your friends</h2>
  </section>
  <img src="/about/meeting_joining_{$isDark ? 'dark' : 'light'}.gif" alt="Join a meet" />
</article>
<footer class="mt-4 max-w-lg mx-auto px-6">
  <a href="https://bryanmylee.github.io/" class="block card p-4 rounded-b-none text-sm">
    <p class="text-center">
      Proudly developed by
      <span class="font-bold text-gradient-primary"> Bryan Lee </span>
    </p>
  </a>
</footer>

<style lang="postcss">
  img {
    @apply rounded-xl;
  }
</style>
