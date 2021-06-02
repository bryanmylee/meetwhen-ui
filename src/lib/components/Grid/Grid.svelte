<script lang="ts">
  import { cssVars } from '$lib/utils/use-css-vars';

  let className = '';
  export { className as class };

  export let rows = 1;
  export let cols = 1;
  $: vars = { rows, cols };
</script>

<div class="{className} grid" use:cssVars={vars}>
  <slot />
</div>

<style>
  div {
    grid-template: repeat(var(--rows), auto) / repeat(var(--cols), auto);
  }
</style>
