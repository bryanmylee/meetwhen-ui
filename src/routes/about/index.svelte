<script>
  import { isDark } from '$lib/app-state';

  const highlightedClass = 'font-bold text-transparent bg-clip-text bg-gradient-primary';
</script>

<article class="max-w-lg p-6 mx-auto space-y-4">
  <section class="card p-4 space-y-2">
    <h1 class="text-lg font-medium">About</h1>
    <p>
      <span class={highlightedClass}>meetwhen</span> makes group meetings quick and easy!
    </p>
  </section>
  <section class="card p-4 space-y-2">
    <h2 class="font-medium">Create meetings</h2>
    <img src="/about/new_{$isDark ? 'dark' : 'light'}.png" alt="Create a new meet" />
  </section>
  <section class="card p-4 space-y-2">
    <h2 class="font-medium">Join your friends</h2>
    <img src="/about/meeting_joining_{$isDark ? 'dark' : 'light'}.gif" alt="Join a meet" />
  </section>
</article>

<style lang="postcss">
  img {
    @apply rounded-xl;
  }
</style>
