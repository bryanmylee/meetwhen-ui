<script>
  import { slide } from 'svelte/transition';

  import { formEnum, form } from '../../stores';

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
        <h5 class="tip error" transition:slide={{ duration: 200 }}>
          Schedule cannot be empty
        </h5>
      {/if}
    </div>
  </div>
{/if}

<style>
  .container {
    padding: 0.8rem;
  }

  .error {
    color: var(--error-0);
  }
</style>