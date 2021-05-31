<script lang="ts">
  import { cssVars } from '$lib/utils/use-css-vars';

  let className = '';
  export { className as class };

  export let x = 0;
  export let y = 0;
  export let width = 1;
  export let height = 1;
  $: vars = {
    rowStart: y + 1,
    rowEnd: y + 1 + height,
    colStart: x + 1,
    colEnd: x + 1 + width,
  };
</script>

<div class={className} use:cssVars={vars}>
  <slot />
</div>

<style>
  div {
    grid-area: var(--rowStart) / var(--colStart) / var(--rowEnd) / var(--colEnd);
  }
</style>
