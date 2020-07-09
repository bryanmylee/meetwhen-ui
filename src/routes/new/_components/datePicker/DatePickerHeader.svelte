<script>
  import { slide } from 'svelte/transition';

  import ErrorTip from 'src/components/ErrorTip.svelte';

  export let showError = false;
</script>

<!-- CALENDAR PICKER CARD TITLE HEADER -->
<!-- Wrap the slide transition within an extra div to prevent jitter issue
on Chrome and Firefox -->
<div>
  <div class="container" transition:slide={{duration: 400}}>
    <h3>
      When are you free?
    </h3>
    <ErrorTip show={showError}>Pick at least one date</ErrorTip>
  </div>
</div>

<style>
  .container {
    padding: 0.8rem;
  }
</style>