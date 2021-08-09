<script lang="ts">
  import Head from '$lib/components/Head.svelte';
  import Help from './_Help.svelte';
</script>

<Head subtitle="help" emoji="🔬" />

<article class="max-w-lg p-6 pb-4 mx-auto space-y-4">
  <section class="p-4 space-y-2 card">
    <h1 class="text-2xl font-bold">Help</h1>
    <p>Learn how to use <span class="font-bold text-gradient-primary">meetwhen</span>!</p>
  </section>
  <Help />
</article>
<footer class="max-w-lg px-6 pb-4 mx-auto">
  <a href="https://bryanmylee.github.io/" class="block p-4 text-sm card hover:ring ring-primary">
    <p class="text-base italic text-center">
      Proudly developed by
      <span class="font-bold text-gradient-primary"> Bryan Lee </span>
    </p>
  </a>
</footer>
