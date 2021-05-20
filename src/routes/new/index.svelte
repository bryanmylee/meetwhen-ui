<script lang="ts">
  import Head from '$lib/components/Head.svelte';
  import Textfield from '$lib/components/Textfield.svelte';
</script>

<Head emoji="✏️" subtitle="new event" />

<section class="max-w-lg p-6 pt-20 mx-auto space-y-4">
  <div class="p-4 space-y-4 card">
    <Textfield placeholder="Event Name" class="w-full" />
    <div class="space-y-4">
      <h2>Set a time for everyone</h2>
      <div class="flex items-center space-x-4">
        <span>From</span>
        <span>To</span>
      </div>
    </div>
  </div>
  <button class="w-full p-3 button gradient card"> Create Event </button>
</section>
