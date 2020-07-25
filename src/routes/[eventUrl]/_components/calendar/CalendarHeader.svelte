<script>
  import { slide } from 'svelte/transition';

  import { formEnum, form } from '../../stores';

  import ErrorTip from 'src/components/ErrorTip.svelte';

  export let showError = false;
</script>

<!-- CALENDAR PICKER CARD TITLE HEADER -->
<!-- Wrap the slide transition within an extra div to prevent jitter issue
on Chrome and Firefox -->
{#if $form === formEnum.JOINING || $form === formEnum.EDITING}
  <div>
    <div class="container" transition:slide={{ duration: 400 }}>
      <h3>
        When are you free?
      </h3>
      {#if showError}
        <ErrorTip>
          Schedule cannot be empty
        </ErrorTip>
      {/if}
    </div>
  </div>
{/if}

<style>
  .container {
    padding: 0.8rem;
  }
</style>