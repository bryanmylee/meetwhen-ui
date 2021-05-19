<script lang="ts">
  import Head from '$lib/components/Head.svelte';
  import FindEvent from './_FindEvent.svelte';
</script>

<Head />

<section class="max-w-lg p-6 mx-auto space-y-4">
  <div class="p-4 text-white card bg-gradient-primary">
    <h1 class="text-xl font-bold">meetwhen</h1>
    <p>Find the perfect time to meet up with your team</p>
  </div>
  <div class="p-4 space-y-4 card">
    <h2>Get started with a new event</h2>
    <form class="flex space-x-4">
      <input type="text" placeholder="new event name..." class="flex-1 bg-gray-100 rounded-xl" />
    </form>
  </div>
  <FindEvent />
</section>
