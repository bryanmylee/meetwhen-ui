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
    grid-template: repeat(var(--rows), 1fr) / repeat(var(--cols), 1fr);
  }
</style>
