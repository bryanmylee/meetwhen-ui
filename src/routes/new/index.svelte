<script lang="ts">
  import { newEventName } from '$lib/state';
  import DatePicker from '$lib/components/DatePicker/DatePicker.svelte';
  import Head from '$lib/components/Head.svelte';
  import Textfield from '$lib/components/Textfield.svelte';
  import FromToHourPicker from '$lib/components/FromToHourPicker/FromToHourPicker.svelte';
</script>

<Head emoji="✏️" subtitle="new event" />

<section class="max-w-lg p-6 pt-20 mx-auto space-y-4">
  <div class="p-4 space-y-4 card">
    <Textfield bind:value={$newEventName} placeholder="Event Name" class="w-full" />
    <h2>Set a time for everyone</h2>
    <DatePicker />
    <FromToHourPicker />
  </div>
  <button class="w-full p-3 button gradient card"> Create Event </button>
</section>
