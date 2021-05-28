<script lang="ts">
  import { newEventName } from '$lib/app-state';
  import { receive, send } from '$lib/app-crossfade';
  import DatePicker from '$lib/components/DatePicker/DatePicker.svelte';
  import Textfield from '$lib/components/Textfield.svelte';
  import FromToHourPicker from '$lib/components/FromToHourPicker/FromToHourPicker.svelte';
  import { selectedDates, from, to } from './_state/intervals';
</script>

<section class="p-4 space-y-4 card">
  <div in:receive={{ key: 'new-name' }} out:send={{ key: 'new-name' }} class="flex-1">
    <Textfield
      bind:value={$newEventName}
      placeholder="Name your event"
      focusOnMount
      class="w-full"
    />
  </div>
  <h2>Set a time for everyone</h2>
  <DatePicker bind:selectedDates={$selectedDates} />
  <FromToHourPicker bind:from={$from} bind:to={$to} />
</section>
