<script lang="ts">
  import { fade } from 'svelte/transition';

  export let key: unknown;

  export { tin as in };
  let tin = fade;
  export { tout as out };
  let tout = fade;
  export let transition: typeof fade | null = null;
  $: if (transition !== null) {
    tin = transition;
    tout = transition;
  }
</script>

<div class="relative">
  {#key key}
    <div in:tin out:tout on:introstart on:outroend class="absolute inset-0">
      <slot />
    </div>
  {/key}
</div>
