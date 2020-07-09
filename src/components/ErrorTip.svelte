<script>
  import { slide } from 'svelte/transition';

  export let show = false;
</script>

{#if show}
  <h5 class="tip" transition:slide={{duration: 200}}>
    <slot />
  </h5>
{/if}

<style>
  h5 {
    color: var(--error-0);
  }
</style>