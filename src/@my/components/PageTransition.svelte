<script lang="ts" context="module">
  import type { Readable } from 'svelte/store';
  export type ITransitioning = Readable<boolean>;
</script>

<script lang="ts">
  import { setContext } from 'svelte';
  import { writable } from 'svelte/store';
  import { fade } from 'svelte/transition';

  export let refresh: any;
  export { tIn as in };
  let tIn = fade;
  export { tOut as out };
  let tOut = fade;
  export let transition = null;
  $: if (transition) tIn = tOut = transition;

  const transitioning = writable(false);
  setContext('transitioning', { subscribe: transitioning.subscribe });
</script>

<div class="relative">
  {#key refresh}
    <div
      in:tIn out:tOut
      on:introstart={() => $transitioning = true}
      on:outroend={() => $transitioning = false}
      class="absolute inset-0"
      >
      <slot/>
    </div>
  {/key}
</div>

