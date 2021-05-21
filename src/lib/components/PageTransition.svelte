<script lang="ts">
  import { fade } from 'svelte/transition';

  export let key: unknown;
</script>

<div class="relative">
  {#key key}
    <div transition:fade class="absolute inset-0">
      <slot />
    </div>
  {/key}
</div>
