<script lang="ts">
  import { newEventName } from '$lib/app-state';
  import { receive, send } from '$lib/app-crossfade';
  import DatePicker from '$lib/components/DatePicker/DatePicker.svelte';
  import Head from '$lib/components/Head.svelte';
  import Textfield from '$lib/components/Textfield.svelte';
  import FromToHourPicker from '$lib/components/FromToHourPicker/FromToHourPicker.svelte';
  import AuthModal from '$lib/components/AuthModal/AuthModal.svelte';
  import { selectedDates, from, to, intervals } from './_state';

  let showAuth = false;
  $: console.log($intervals);
</script>

<Head emoji="✏️" subtitle="new event" />

<form class="max-w-lg p-6 mx-auto space-y-4">
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
  <section class="flex space-x-4">
    <button
      type="button"
      on:click={() => (showAuth = true)}
      class="w-full p-3 button shade rounded-xl"
    >
      Login
    </button>
    <button type="submit" class="w-full p-3 button gradient card"> Continue as Guest </button>
  </section>
</form>

{#if showAuth}
  <AuthModal on:dismiss={() => (showAuth = false)} />
{/if}
