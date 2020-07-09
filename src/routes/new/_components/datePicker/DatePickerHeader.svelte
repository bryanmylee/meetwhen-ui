<script>
  import { slide } from 'svelte/transition';

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
    {#if showError}
      <h5 class="tip error" transition:slide={{duration: 200}}>
        Pick at least one date
      </h5>
    {/if}
  </div>
</div>

<style>
  .container {
    padding: 0.8rem;
  }

  .error {
    color: var(--error-0);
  }
</style>