<script lang="ts">
  import Head from '$lib/components/Head.svelte';
  import Help from './_Help.svelte';
</script>

<Head subtitle="about" emoji="🔬" />

<article class="max-w-lg p-6 pb-4 mx-auto space-y-4">
  <section class="card p-4 space-y-2">
    <h1 class="text-lg font-medium">About</h1>
    <p>
      <span class="font-bold text-gradient-primary">meetwhen</span> makes group meetings quick and easy!
    </p>
  </section>
  <Help />
</article>
<footer class="max-w-lg px-6 pb-4 mx-auto">
  <a href="https://bryanmylee.github.io/" class="block card p-4 text-sm hover:ring ring-primary">
    <p class="text-center">
      Proudly developed by
      <span class="font-bold text-gradient-primary"> Bryan Lee </span>
    </p>
  </a>
</footer>
