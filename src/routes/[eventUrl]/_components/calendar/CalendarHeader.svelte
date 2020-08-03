<script>
  import { slide } from 'svelte/transition';

  import { calendarSelectionEnabled } from './stores';

  import ErrorTip from 'src/components/ui/ErrorTip.svelte';

  export let showError = false;
</script>

<!-- CALENDAR PICKER CARD TITLE HEADER -->
<!-- Wrap the slide transition within an extra div to prevent jitter issue
on Chrome and Firefox -->
{#if $calendarSelectionEnabled}
  <div>
    <div class="container" transition:slide={{ duration: 300 }}>
      <div class="header">
        <h3>Pick a time</h3>
      </div>
      <ErrorTip show={showError}>
        Schedule cannot be empty
      </ErrorTip>
    </div>
  </div>
{/if}

<style>
  .container {
    padding: 0.8em;
    padding-bottom: 0;
  }

  .header {
    display: flex;
    justify-content: space-between;
  }
</style>